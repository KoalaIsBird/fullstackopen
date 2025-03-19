import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { resetCaches, useLazyQuery, useQuery } from '@apollo/client'
import ChangeBirthYear from './ChangeBirthYear'
import Login from './Login'
import Recommendations from './components/Recommendations'
import { Link, Route, Routes, useNavigate } from 'react-router'
import { ME } from './components/queries'

const App = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('user-token')

  return (
    <div>
      <div>
        <Link to='/authors'>
          <button>Authors</button>
        </Link>
        <Link to='/books'>
          <button>Books</button>
        </Link>

        {token ? (
          <>
            <Link to='/addbook'>
              <button>Add Book</button>
            </Link>
            <Link to='/recommended'>
              <button>Recommended</button>
            </Link>
            <Link to='/editauthor'>
              <button>Edit Author</button>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('user-token')
                navigate('/')
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login'>
              <button>Login</button>
            </Link>
          </>
        )}
      </div>

      <Routes>
        <Route index element={<h1>Welcome to the book app's index!</h1>} />
        <Route element={<Books />} path='/books' />
        <Route element={<Authors />} path='/authors' />
        <Route element={<Login />} path='/login' />

        {token ? (
          <>
            <Route element={<NewBook />} path='/addbook' />
            <Route
              element={<Recommendations />}
              path='/recommended'
            />
            <Route element={<ChangeBirthYear />} path='/editauthor' />
          </>
        ) : null}
      </Routes>
    </div>
  )
}

export default App
