import Person from './Person'

const Persons = ({filteredPersons, removePerson}) => {
  return (
    <div>
      {filteredPersons.map(person =>
        <Person key = {person.id} person={person} removePerson={removePerson} />
      )}
    </div>
  )
}

export default Persons