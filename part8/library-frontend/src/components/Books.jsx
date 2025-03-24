import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, ME } from './queries'
import { useEffect, useState } from 'react'

const Books = () => {
  const client = useApolloClient()
  const [genre, setGenre] = useState('')
  const {
    loading,
    data: booksReq,
    refetch,
    error
  } = useQuery(ALL_BOOKS, { variables: { genre: genre } })

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      window.alert(`new book ${data.data.bookAdded.title} added`)
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: genre } },
        ({ allBooks }) => {
          return { allBooks: allBooks.concat(data.data.bookAdded) }
        }
      )
    }
  })

  useEffect(() => {
    refetch({ genre: genre })
    console.log('refectched')
  }, [genre])

  if (loading) {
    return <div>loading books...</div>
  }

  return (
    <div>
      <h2>books {genre ? `- ${genre}` : null}</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksReq.allBooks.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genre
          ? null
          : booksReq.allBooks
              .map(book => book.genres)
              .reduce(
                (accumulator, bookGenres) =>
                  accumulator.concat(
                    bookGenres.filter(genre => !accumulator.includes(genre))
                  ),
                []
              )
              .map(genre => (
                <button key={genre} onClick={() => setGenre(genre)}>
                  {genre}
                </button>
              ))}
        {genre ? <button onClick={() => setGenre('')}>all genres</button> : null}
      </div>
    </div>
  )
}

export default Books
