import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { LOGIN_QUERY } from './components/queries'

const Login = ({show, setToken, setPage}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, { data }] = useMutation(LOGIN_QUERY)

  useEffect(() => {
    if (data) {
      setToken(data.login.value)
      localStorage.setItem('user-token', data.login.value)
      setPage('authors')
    }
  }, [data])

  if (!show) {
    return null
  }

  const submit = async event => {
    event.preventDefault()

    login({ variables: {username, password} })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input
            value={password}
            type='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login
