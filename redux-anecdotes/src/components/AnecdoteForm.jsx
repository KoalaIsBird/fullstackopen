import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import {
  setNotification,
  deleteNotification,
} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(addAnecdote(event.target.anecdote.value))
    dispatch(setNotification(`you created '${event.target.anecdote.value}'`))
    setTimeout(() => dispatch(deleteNotification()), 5000)
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
