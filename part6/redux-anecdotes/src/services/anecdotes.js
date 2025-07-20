import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log('getAll response', response.data)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const voteAnecdote = async (id) => {
  const anecdote = await axios.get(`${baseUrl}/${id}`)
  const updatedAnecdote = { ...anecdote.data, votes: anecdote.data.votes + 1 }
  
  const updateResponse = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return updateResponse.data
}

export default { getAll, createNew, voteAnecdote }