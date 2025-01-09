import PropTypes from 'prop-types'
import { useState } from 'react'

const CreateBlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateNewBlog = async event => {
    event.preventDefault()
    try {
      await onCreate(title, author, url)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {}
  }

  return (
    <form
      onSubmit={handleCreateNewBlog}
      className='card card-content bg-base-200 max-w-60 p-2 *:my-1'
    >
      <input
        className='input input-sm input-bordered'
        placeholder='Blog Title'
        type='text'
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />
      <input
        className='input input-sm input-bordered'
        placeholder='Blog Author'
        type='text'
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />
      <input
        className='input input-sm input-bordered'
        placeholder='Blog URL'
        type='text'
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />
      <button className='btn btn-primary btn-sm w-1/2 self-center' type='submit'>
        Create
      </button>
    </form>
  )
}

CreateBlogForm.propTypes = {
  onCreate: PropTypes.func.isRequired
}

export default CreateBlogForm
