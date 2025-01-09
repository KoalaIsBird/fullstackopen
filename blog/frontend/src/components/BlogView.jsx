import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { notificate } from '../redux'
import blogsService from '../services/blogs'

const BlogView = () => {
  const [blog, setBlog] = useState(null)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const id = useParams().id

  useEffect(() => {
    blogsService.getOne(id).then(response => setBlog(response))
  }, [])

  const handleClick = () => {
    blogsService.likeById(id).then(() => {
      setBlog(prevBlog => ({ ...prevBlog, likes: prevBlog.likes + 1 }))
    })
  }

  const handleComment = async event => {
    event.preventDefault()
    try {
      const newBlog = await blogsService.comment(id, comment)
      setBlog(newBlog)
      setComment('')
    } catch (error) {
      dispatch(notificate('comment cannot be empty', 'error', 5000))
    }
  }

  if (!blog) {
    return <div>loading blog...</div>
  }

  return (
    <div>
      <h2 className='text-xl font-bold'>
        {blog.title} - {blog.author}
      </h2>
      <Link className='link link-primary' to={blog.url}>
        {blog.url}
      </Link>

      <div className='my-4'>
        <p>
          <span className='font-bold'>{blog.likes}</span> likes
        </p>
        <button className='btn btn-sm btn-primary' onClick={handleClick}>
          Like
        </button>
      </div>
      <p>
        Added by <span className='font-bold'>{blog.user.name}</span>
      </p>
      <div className='divider divider-start'>Comments</div>
      <form
        className='card card-body bg-base-200 p-6 max-w-72 my-4'
        onSubmit={handleComment}
      >
        <input
          className=' input-sm textarea textarea-bordered'
          onChange={e => setComment(e.target.value)}
          value={comment}
        />
        <button className='btn btn-sm btn-primary' type='submit'>
          Add Comment
        </button>
      </form>
      <ul className='list-disc list-inside'>
        {blog.comments.map(comment => (
          <li className='list-item' key={comment._id}>
            {comment.content}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
