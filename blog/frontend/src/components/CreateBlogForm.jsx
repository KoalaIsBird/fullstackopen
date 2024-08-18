import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    try {
      await onCreate(title, author, url)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {}
  }

  return (
    <form onSubmit={handleCreateNewBlog}>
      <div>
        title:
        <input
          type="text"
          name="Title"
          value={title}
          placeholder="write blog title here"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          name="Author"
          value={author}
          placeholder="write blog author here"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          name="Url"
          value={url}
          placeholder="write blog url here"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

CreateBlogForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
}

export default CreateBlogForm
