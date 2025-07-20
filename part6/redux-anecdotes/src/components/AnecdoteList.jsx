import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)
    
  const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter))
  
  const getAnecdoteById = (id) => {
    return anecdotes.find(anecdote => anecdote.id === id);
  };

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted '${getAnecdoteById(id).content}'`))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, 5000)
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList;