import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, color: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    setUser(
      JSON.parse(window.localStorage.getItem('loggedInUser'))
    )
  }, [])


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificate('wrong credentials', 'red', 5000)
    }
  }


  const notificate = (message, color, duration) => {
    setNotification({ message, color })
    setTimeout(
      () => setNotification({ message: null, color: null }),
      duration)
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const handleCreateNewBlog = async event => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url }, user.token)
      setBlogs(blogs.concat(newBlog))
      notificate(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'green', 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      notificate('invalid blog', 'red', 5000)
    }
  }


  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} color={notification.color} />
        <h2>Log in to application</h2>
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
          <button onClick={handleLogin}>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} color={notification.color} />
      <h2>blogs</h2>
      <p>{user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <form onSubmit={handleCreateNewBlog}>
        <div>
          title:
          <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App