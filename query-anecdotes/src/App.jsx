import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import { notificate, useNotificationDispatch } from './NotificationContext'

const App = () => {
  const notifDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (_, anecdote) => {
      notificate(notifDispatch, anecdote.content, 'VOTE')
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const result = useQuery({
    queryFn: getAnecdotes,
    queryKey: ['anecdotes'],
    retry: false,
  })

  if (result.isLoading) {
    return <div>data is loading</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
