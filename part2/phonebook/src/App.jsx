import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }
  , []);

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    
    if (personExist(newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    };

    setPersons([...persons, newPerson]);
  };

  const personExist = function(name) {
    return persons.some(person => person.name === name);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={nameFilter} handleFilterChange={handleNameFilterChange} />
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        name={newName} handleNameChange={handleNewNameChange} 
        number={newNumber} handleNumberChange={handleNewNumberChange} 
      />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} />
    </div>
  )
}

export default App