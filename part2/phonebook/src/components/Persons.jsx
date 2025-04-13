const Persons = ({ persons, nameFilter }) => {
  return (
    <div>
      {persons.map((person) => (
        person.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
          <div key={person.id}>{person.name} {person.number}</div>
      ))}
    </div>
  )
};

export default Persons;