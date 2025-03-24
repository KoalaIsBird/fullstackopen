import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v1 as uuid } from 'uuid'
import { connect } from 'mongoose'
import jwt from 'jsonwebtoken'

import { typeDefs } from './typeDefs.js'
import { resolvers } from './resolvers.js'
import cors from 'cors'
import { createServer } from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import express, { json } from 'express'

// require('dotenv').config()
import dotenv from 'dotenv'
import { expressMiddleware } from '@apollo/server/express4'
dotenv.config()

connect(process.env.MONGODB_URI)
  .then(res => console.log('logged in to mongodb'))
  .catch(error => console.log('error logging in to mongodb'))

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers })

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express()
const httpServer = createServer(app)

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer

  // path: '/subscriptions',
})
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer)

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})

await server.start()
app.use(
  '/',
  cors(),
  json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const token = req.headers.authorization

      if (!token) {
        return null
      }

      return jwt.verify(token, process.env.JWT_SECRET)
    }
  })
)

const PORT = 4000
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}`)
})
