const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')
const mongoose = require('mongoose')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

require('dotenv').config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(res => console.log('logged in to mongodb'))
  .catch(error => console.log('error logging in to mongodb'))

const typeDefs = `
  

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
    
  type Book {
      title: String!
      author: Author!
      published: Int!
      genres: [String!]!
      id: ID!
    }

  type User {
  username: String!
  favoriteGenre: String!
  _id: ID!
}

  type Token {
  value: String!
}

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
}

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
    username: String!
    favoriteGenre: String!
    ): User

    login(
    username: String!
    password: String!
  ): Token
  }
  
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context
    },
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find({}).populate('author')
      }

      if (args.author && args.genre) {
        const argAuthor = await Author.findOne({ name: args.author })
        return await Book.find({
          genres: { $in: [args.genre] },
          author: argAuthorId
        }).populate('author')
      }

      if (args.author) {
        console.log('in author: why??')
        const argAuthorId = await Author.findOne({ name: args.author })
        return await Book.find({ author: argAuthorId._id }).populate('author')
      }

      const bookWithGenre = await Book.find({ genres: { $in: [args.genre] } }).populate(
        'author'
      )
      return bookWithGenre
    },

    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async root => await Book.countDocuments({ author: root.id })
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context) {
        throw new GraphQLError('No user logged in', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let bookAuthor = await Author.findOne({ name: args.author })

      try {
        if (!bookAuthor) {
          bookAuthor = new Author({ name: args.author })
          await bookAuthor.save()
        }

        const newBook = new Book({ ...args, author: bookAuthor })
        await newBook.save()

        return newBook
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context) {
        throw new GraphQLError('No user logged in', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      await author.save()
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      return await user.save()
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('Login failed', { extensions: { code: 'BAD_USER_INPUT' } })
      }

      return { value: jwt.sign(user._doc, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const token = req.headers.authorization

    if (!token) {
      return null
    }

    return jwt.verify(token, process.env.JWT_SECRET)
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
