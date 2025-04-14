const Persons = ({ persons, nameFilter, handleRemovePerson }) => {
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
        .map((person) => (
          <div key={person.id}>
            {person.name} {person.number} <button type='button' onClick={() => handleRemovePerson(person.id, person.name)}>delete</button>
          </div>
      ))}
    </div>
  )
};

export default Persons;