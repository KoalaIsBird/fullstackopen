import { useSelector, useDispatch } from 'react-redux'
import { voteAction } from '../reducers/anecdoteReducer'

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

  const vote = (id) => {
    dispatch(voteAction(id))
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
