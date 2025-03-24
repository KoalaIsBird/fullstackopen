import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { BrowserRouter } from 'react-router'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const headerLink = new ApolloLink((operation, forward) => {
  const localToken = localStorage.getItem('user-token')
  if (localToken) {
    operation.setContext(c => ({
      ...c,
      headers: { ...c.headers, authorization: localToken }
    }))
  }

  return forward(operation)
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000'
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    )
  },
  wsLink,
  headerLink.concat(httpLink)
)

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </ApolloProvider>
)
