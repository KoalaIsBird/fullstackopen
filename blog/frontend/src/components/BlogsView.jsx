import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addBlog,
  likeBlog,
  notificate,
  removeBlog,
  setBlogs,
  sortBlogsByLikes
} from '../redux'
import blogService from '../services/blogs'
import Blog from './Blog'
import CreateBlogForm from './CreateBlogForm'
import Togglable from './Togglable'

const BlogsView = () => {
  const dispatch = useDispatch()
  const createFormRef = useRef()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  // load blogs intially
  useEffect(() => {
    blogService.getAll().then(blogs => {
      dispatch(setBlogs(blogs))
      dispatch(sortBlogsByLikes())
    })
  }, [])

  // handle creation of new blog
  const handleCreateNewBlog = async (title, author, url) => {
    try {
      const newBlog = await blogService.create({ title, author, url }, user.token)
      dispatch(addBlog(newBlog))
      createFormRef.current.toggleVisibility()
      dispatch(
        notificate(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          'success',
          5000
        )
      )
    } catch (exception) {
      dispatch(notificate('invalid blog', 'error', 5000))
      throw exception
    }
  }

  // remove a blog
  const handleRemove = async blogId => {
    await blogService.remove(blogId)
    dispatch(removeBlog(blogId))
  }

  // handle a like, given a blog
  const handleLike = async blog => {
    const receivedBlog = await blogService.replace(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })

    dispatch(likeBlog(blog.id))
    dispatch(sortBlogsByLikes())
  }

  return (
    <div>
      <h2 className='text-2xl font-bold'>create new</h2>
      <Togglable buttonLabel='New Blog' ref={createFormRef}>
        <CreateBlogForm onCreate={handleCreateNewBlog} />
      </Togglable>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogsView
