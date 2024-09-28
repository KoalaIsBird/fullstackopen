import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push({
        content: action.payload.content,
        id: action.payload.id,
        votes: action.payload.votes
      })
    },
    vote(state, action) {
      return state.map(anecdote =>
        anecdote.id === action.payload
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const {addAnecdote, vote, setAnecdotes } = anecdoteSlice.actions

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.addOne(content)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const voteFor = id => {
  return async dispatch => {
    await anecdoteService.vote(id)
    dispatch(vote(id))
  }
}

export default anecdoteSlice.reducer