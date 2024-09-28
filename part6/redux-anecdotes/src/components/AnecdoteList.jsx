import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((store) => {
    const sortFun = (a, b) => {
      console.log(a, b, a.votes < b.votes ? 1 : 0)
      return a.votes < b.votes ? 1 : -1
    }
    return store.filter === ''
      ? store.anecdotes.toSorted(sortFun)
      : store.anecdotes
          .filter((a) => a.content.toLowerCase().includes(store.filter.toLowerCase()))
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
