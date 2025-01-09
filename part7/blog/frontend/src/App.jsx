import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import BlogsView from './components/BlogsView'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import UsersView from './components/UsersView'
import UserView from './components/UserView'
import { notificate, setUser } from './redux'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  // log in user with credentials in its browser if there are
  useEffect(() => {
    const localUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (localUser) {
      dispatch(setUser(localUser))
      blogService.setToken(localUser.token)
    }
  }, [])

  // handle login
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      dispatch(setUser(user))
      blogService.setToken(user.token)
    } catch (exception) {
      dispatch(notificate('wrong credentials', 'error', 5000))
      window.localStorage.clear()
      dispatch(setUser(null))
      throw exception
    }
  }

  const handleRegister = event => {}

  // handle logout
  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    dispatch(setUser(null))
  }

  // if user is not logged in
  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={handleLogin} />
      </>
    )
  }

  // if user is logged in
  return (
    <div>
      <nav className='navbar'>
        <h2 className='hidden md:flex navbar-start text-xl font-extrabold'>BlogApp</h2>
        <div className='navbar-right'>
          <Link className='btn' to='/'>
            blogs
          </Link>
          <Link className='btn' to='users'>
            users
          </Link>
          <button className='btn' onClick={handleLogout}>
            logout
          </button>
        </div>
        <p className='navbar-end'>{user.name}</p>
      </nav>

      <Notification />

      <div className='mx-6'>
        <Routes>
          <Route path='/' element={<BlogsView />} />
          <Route path='/users' element={<UsersView />} />
          <Route path='/users/:id' element={<UserView />} />
          <Route path='/blogs/:id' element={<BlogView />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
