import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { notificate } from '../redux'
import usersService from '../services/users'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [regPassword, setRegPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regUsername, setRegUsername] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async event => {
    event.preventDefault()
    try {
      await onLogin(username, password)
      setUsername('')
      setPassword('')
    } catch {}
  }

  const handleRegister = async event => {
    event.preventDefault()
    try {
      await usersService.create(regUsername, regName, regPassword)
      dispatch(notificate(`user ${username} successfully created`, 'success', 5000))
      setRegName('')
      setRegPassword('')
      setRegUsername('')
    } catch (error) {
      dispatch(
        notificate(
          error.response.status === 401
            ? error.response.data.error
            : `there was an error while registering`,
          'error',
          5000
        )
      )
    }
  }

  return (
    <>
      {' '}
      <form className='card-side md:card bg-base-200 shadow-xl max-w-80 m-auto my-10'>
        <div className='card-body'>
          <h2 className='card-title justify-center'>Log in to application</h2>
          <input
            placeholder='Username'
            className='input input-bordered'
            type='text'
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
          />
          <input
            placeholder='Password'
            className='input input-bordered'
            type='password'
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
          <div className='card-actions justify-center'>
            <button className='btn btn-primary' onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </form>
      <form
        onSubmit={handleRegister}
        className='card-side md:card bg-base-200 shadow-xl max-w-80 m-auto my-10'
      >
        <div className='card-body'>
          <h2 className='card-title justify-center'>Or register</h2>
          <input
            placeholder='Name'
            className='input input-bordered'
            type='text'
            value={regName}
            onChange={({ target: { value } }) => setRegName(value)}
          />
          <input
            placeholder='Username'
            className='input input-bordered'
            type='text'
            value={regUsername}
            onChange={({ target: { value } }) => setRegUsername(value)}
          />
          <input
            placeholder='Password'
            className='input input-bordered'
            type='password'
            value={regPassword}
            onChange={({ target: { value } }) => setRegPassword(value)}
          />
          <div className='card-actions justify-center'>
            <button className='btn btn-primary' onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default LoginForm
