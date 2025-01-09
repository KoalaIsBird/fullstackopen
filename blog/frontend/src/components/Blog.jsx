import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div className='blog'>
      <Link className='card card-body bg-base-200 my-1 p-4' to={`blogs/${blog.id}`}>
        {blog.title} - {blog.author}
      </Link>
    </div>
  )
}

export default Blog
