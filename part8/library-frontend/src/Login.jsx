import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { LOGIN_QUERY, ME } from './components/queries'
import { Link, useNavigate } from 'react-router'

const Login = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [login, { data }] = useMutation(LOGIN_QUERY, {
    onCompleted: data => {
      localStorage.setItem('user-token', data.login.value)
      navigate('/')
    }
  })

  const submit = async event => {
    event.preventDefault()

    login({ variables: { username, password } })

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
