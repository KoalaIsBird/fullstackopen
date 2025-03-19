import { useQuery } from '@apollo/client'
import { GET_BOOKS } from './queries'
import { useEffect, useState } from 'react'

const Books = props => {
  const [genre, setGenre] = useState('')
  const [displayData, setDisplayData] = useState([])
  const { loading, data } = useQuery(GET_BOOKS)

  useEffect(() => {
    if (loading) {
      return
    }

    if (genre === '') {
      setDisplayData(data.allBooks)
      return
    }

    setDisplayData(
      data.allBooks.filter(b => b.genres.find(g => g === genre) !== undefined)
    )
  }, [data, genre])


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
          {displayData.map(a => (
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
          : displayData
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
