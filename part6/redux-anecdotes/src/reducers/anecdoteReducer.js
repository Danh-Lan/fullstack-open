import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const updatedAnecdotes = state.map(anecdote => (
        anecdote.id === action.payload
          ? {...anecdote, votes: anecdote.votes + 1} 
          : anecdote
      ))

      // sort by desc order of vote
      const sortedAnecdotes = updatedAnecdotes.sort((anecDoteA, anecdoteB) => {
        return anecdoteB.votes - anecDoteA.votes
      })

      return sortedAnecdotes
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer