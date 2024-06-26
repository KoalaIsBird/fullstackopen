import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  // make mostVotedIndex the index of the most voted for anecdote and mostVotes 
  // it's number of votes
  let mostVotedIndex = 0
  let mostVotes = 0
  for (let index = 0; index < anecdotes.length; index += 1) {
    if (votes[index] > mostVotes) {
      mostVotedIndex = index
      mostVotes = votes[index]
    }
  }

  const handleNext = () => {
    // make sure that the next anecdote is not the same as the current one
    let nextIndex = selected
    if (anecdotes.length > 1) {
      while (nextIndex === selected) {
        nextIndex = Math.floor(Math.random() * anecdotes.length)
      }
    }
    setSelected(nextIndex)
  }

  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}<br /> has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVotedIndex]}<br /> has {mostVotes} votes</p>
    </div>
  )
}

export default App