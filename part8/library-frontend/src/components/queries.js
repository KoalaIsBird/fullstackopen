import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
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
