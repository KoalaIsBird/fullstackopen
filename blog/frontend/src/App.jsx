import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, color: null })

  const createFormRef = useRef()

  // get blogs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogsByLikes(blogs))
    )
  }, [])

  // log in user with credentials in its browser if there are
  useEffect(() => {
    const localUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if (localUser) {
      setUser(
        localUser
      )
      blogService.setToken(localUser.token)
    }
  }, [])

  // handle login
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
    } catch (exception) {
      notificate('wrong credentials', 'red', 5000)
      throw exception
    }
  }

  // notificate the user of something
  const notificate = (message, color, duration) => {
    setNotification({ message, color })
    setTimeout(
      () => setNotification({ message: null, color: null }),
      duration)
  }

  // handle logout
  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  // handle creation of new blog
  const handleCreateNewBlog = async (title, author, url) => {
    try {
      const newBlog = await blogService.create({ title, author, url }, user.token)
      setBlogs(blogs.concat(newBlog))
      createFormRef.current.toggleVisibility()
      notificate(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'green', 5000)
    } catch (exception) {
      notificate('invalid blog', 'red', 5000)
      throw exception
    }
  }

  // handle a like, given a blog
  const handleLike = async blog => {
    const receivedBlog = await blogService.replace(
      blog.id,
      { ...blog, likes: blog.likes + 1, user: blog.user.id }
    )

    const updatedBlogs = blogs
      .map(localBlog =>
        localBlog.id === blog.id
          ? { ...localBlog, likes: receivedBlog.likes }
          : localBlog
      )

    setBlogs(
      sortBlogsByLikes(
        updatedBlogs
      )
    )
  }

  // return new array, which is the given blogs array but sorted
  const sortBlogsByLikes = blogs => {
    return blogs.toSorted((blog1, blog2) => blog2.likes - blog1.likes)
  }

  const handleRemove = async blogId => {
    await blogService.remove(blogId)
    setBlogs(blogs.filter(localBlog => localBlog.id !== blogId))
  }

  // if user is not logged in
  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} color={notification.color} />
        <h2>Log in to application</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  // if user is logged in
  return (
    <div>
      <Notification message={notification.message} color={notification.color} />
      <h2>blogs</h2>
      <p>{user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <Togglable buttonLabel='new blog' ref={createFormRef}>
        <CreateBlogForm onCreate={handleCreateNewBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onRemove={handleRemove} />
      )}
    </div>
  )
}

export default App