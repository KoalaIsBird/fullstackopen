import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await onLogin(username, password)
      setUsername('')
      setPassword('')
    } catch {}
  }

  return (
    <form>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button onClick={handleSubmit}>login</button>
    </form>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default LoginForm
