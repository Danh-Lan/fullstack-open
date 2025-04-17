import { useEffect, useState } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName);
        const updatedPerson = { name: newName, number: newNumber };

        handleUpdatePerson(personToUpdate.id, updatedPerson);
      }

      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    };

    personsService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons([...persons, returnedPerson])
        handleUpdateNotification(`Added ${newName}`, 'success');
      })
      .catch(error => {
        console.log(error.response.data.error);
      })
  };

  const personExist = function(name) {
    return persons.some(person => person.name === name);
  }

  const handleUpdatePerson = (id, updatedPerson) => {
    personsService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => (person.id === id ? returnedPerson : person)))
        handleUpdateNotification(`Updated ${returnedPerson.name}'s number`, 'success');
      })
      .catch(error => {
        console.log(error.response.data.error);
        
        // setNotification(`Information of ${updatedPerson.name} has already been removed from server`);
        // setNotificationType('error');
        // setTimeout(() => {
        //   setNotification(null);
        //   setNotificationType(null);
        // }
        // , 3000);
        // setPersons(persons.filter(person => (person.id !== id)))
      })
  }

  const handleRemovePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => 
          setPersons(persons.filter(person => (person.id !== id)))
        )
        .catch(error => {
          handleUpdateNotification(`Information of ${name} has already been removed from server`, 'error');
          setPersons(persons.filter(person => (person.id !== id)))
        })
    }
  };

  const handleUpdateNotification = (message, type, duration=3000) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
      setNotificationType(null);
    }, duration);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={nameFilter} handleFilterChange={handleNameFilterChange} />
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        name={newName} handleNameChange={handleNewNameChange} 
        number={newNumber} handleNumberChange={handleNewNumberChange} 
      />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} handleRemovePerson={handleRemovePerson} />
    </div>
  )
}

export default App