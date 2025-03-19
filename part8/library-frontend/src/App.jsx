import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client'
import ChangeBirthYear from './ChangeBirthYear'
import Login from './Login'
import Recommendations from './components/Recommendations'

const ME = gql`
  query {
    me {
      username
      favoriteGenre
      _id
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const { loading, data } = useQuery(ME, { skip: !token })

  useEffect(() => {
    if (!data) {
      return
    }
    setUser(data.me)
  }, [data])

  useEffect(() => {
    const localToken = localStorage.getItem('user-token')
    if (localToken) {
      setToken(localToken)
    }
  }, [])

  //useEffect(() => {}, [token])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {user ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommendations</button>
            <button onClick={() => setPage('changeBirthYear')}>author birth year</button>
            <button
              onClick={() => {
                localStorage.removeItem('user-token')
                setToken(null)
                setUser(null)
                setPage('authors')
              }}
            >
              logout
            </button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      {user ? (
        <>
          <Recommendations
            show={page === 'recommendations'}
            favoriteGenre={user.favoriteGenre}
          />

          <NewBook show={page === 'add'} />

          <ChangeBirthYear show={page === 'changeBirthYear'} />
        </>
      ) : null}

      <Login show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App
