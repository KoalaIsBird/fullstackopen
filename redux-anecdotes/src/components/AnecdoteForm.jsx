import { useDispatch } from 'react-redux'
import { addAnecdoteAction } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(addAnecdoteAction(event.target.anecdote.value))
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
