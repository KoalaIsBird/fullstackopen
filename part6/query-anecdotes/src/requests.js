import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
    axios.get(baseUrl).then(res => res.data)

export const addAnecdote = newAnecdote => {
    return axios.post(baseUrl, newAnecdote).then(res => res.data)
}

export const voteAnecdote = newAnecdote =>
    axios.put(`${baseUrl}/${newAnecdote.id}`, { ...newAnecdote, votes: newAnecdote.votes + 1 })