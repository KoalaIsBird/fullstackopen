import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`

export const ALL_BOOKS = gql`
  query getBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const CHANGE_BIRTH_YEAR = gql`
  mutation changeBirthYear($name: String!, $birthYear: Int!) {
    editAuthor(name: $name, setBornTo: $birthYear) {
      born
      id
    }
  }
`
export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      id
    }
  }
`
export const LOGIN_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
export const ME = gql`
  query {
    me {
      
      favoriteGenre
      _id
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
