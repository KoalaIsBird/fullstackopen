import { useQuery } from '@apollo/client'
import { GET_BOOKS, ME } from './queries'
import { useEffect, useState } from 'react'

const Recommendations = props => {
  // const [displayData, setDisplayData] = useState([])
  const { loading: bookLoading, data: bookData } = useQuery(GET_BOOKS)
  const { loading: userLoading, data: userData } = useQuery(ME)

  if (bookLoading || userLoading) {
    return <div>loading...</div>
  }

  const books = bookData.allBooks.filter(
    b => b.genres.find(g => g === userData.me.favoriteGenre) !== undefined
  )

  if (!books) {
    return <div>no suggestions</div>
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
          {books.map(a => (
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
