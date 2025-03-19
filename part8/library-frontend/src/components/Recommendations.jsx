import { useQuery } from '@apollo/client'
import { GET_BOOKS } from './queries'
import { useEffect, useState } from 'react'

const Recommendations = props => {
  const [displayData, setDisplayData] = useState([])
  const { loading, data } = useQuery(GET_BOOKS)

  useEffect(() => {
    if (loading) {
      return
    }

    setDisplayData(
      data.allBooks.filter(
        b => b.genres.find(g => g === props.favoriteGenre) !== undefined
      )
    )
  }, [data])

  if (!props.show) {
    return null
  }

  if (displayData.length === 0) {
    return <div>no books to suggest</div>
  }

  return (
    <div>
      <h2>recommended books</h2>

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
    </div>
  )
}

export default Recommendations
