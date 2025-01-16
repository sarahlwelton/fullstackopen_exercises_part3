const Person = ( {person, removePerson} ) => {
    return (
      <p>{person.name}: {person.number} <button onClick={() => removePerson(person.id)}>delete</button></p>
    )
}

export default Person