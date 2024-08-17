import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateNoteForm = ({ onCreate }) => {
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
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          name="Author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input type="text" name="Url" value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

CreateNoteForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
}

export default CreateNoteForm
