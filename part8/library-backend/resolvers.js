const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/User')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']) }
  },
  Query: {
    me: (root, args, context) => {
      console.log(context)
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

      if (!bookAuthor) {
        bookAuthor = new Author({ name: args.author, bookCount: 1 })
        await bookAuthor.save()
      } else {
        bookAuthor.bookCount += 1
        await bookAuthor.save()
      }

      let newBook = new Book({ ...args, author: bookAuthor })
      newBook = await newBook.save()

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook
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
exports.resolvers = resolvers
