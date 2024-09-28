import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()

    dispatch(createAnecdote(event.target.anecdote.value))

    dispatch(setNotification(`you created '${event.target.anecdote.value}'`, 5))
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
