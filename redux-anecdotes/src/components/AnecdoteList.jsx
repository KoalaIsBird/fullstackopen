import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const sortFun = (n1, n2) => (n1.votes > n2.votes ? 0 : 1)
    return filter === ''
      ? anecdotes.toSorted(sortFun)
      : anecdotes
          .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
          .toSorted(sortFun)
  })

  const handleVote = (content, id) => {
    dispatch(voteFor(id))
    dispatch(setNotification(`you voted '${content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                handleVote(anecdote.content, anecdote.id)
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
