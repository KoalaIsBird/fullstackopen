import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addAnecdote } from '../requests'
import { notificate, useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const notifDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: addAnecdote,
    onSuccess: (anecdote) => {
      notificate(notifDispatch, anecdote.content, 'NEW')
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      notificate(
        notifDispatch,
        'too short anecdote, must have length 5 or more',
        'ANY'
      )
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content: content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
