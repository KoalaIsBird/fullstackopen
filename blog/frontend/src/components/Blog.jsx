import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove }) => {
  const [show, setShow] = useState(false)

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    margin: 5,
  }

  const handleLike = async (event) => {
    event.preventDefault()
    await onLike(blog)
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await onRemove(blog.id)
    }
  }

  if (show) {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author} {' '}
        <button onClick={() => setShow(false)}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes} {' '}
        <button onClick={handleLike}>like</button>
        <br />
        {blog.user.name}
        <br />
        <button onClick={handleRemove}>remove</button>
      </div>
    )
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} {' '}
      <button onClick={() => setShow(true)}>view</button>
    </div>
  )
}

export default Blog
