import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personService
      .getPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    },[])

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter)
  )

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      //id: persons.length + 1
    }
    if (persons.some((person) => newName === person.name)) {
      if (window.confirm(`${newName} is already in the phonebook. Do you want to update their number?`)) {
        const findExistingPerson = persons.find(p => p.name === personObject.name)
        const updatedPerson = {...findExistingPerson, number: newNumber}

        personService  
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? returnedPerson : person))
            setMessageType('success')
            setMessage(`Updated ${updatedPerson.name}'s phone number in the phonebook`)
            setTimeout(() => {
              setMessage('')
              setMessageType('')
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessageType('error')
            setMessage(`The entry for ${updatedPerson.name} was already removed from the phonebook.`)
            setTimeout(() => {
              setMessage('')
              setMessageType('')
            }, 5000)
            setNewName('')
            setNewNumber('')
            setPersons(persons.filter(p => p.name !== newName))
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessageType('success')
          setMessage(`Added ${returnedPerson.name} to the phonebook`)
          setTimeout(() => {
              setMessage('')
              setMessageType('')
            }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data)
          setMessageType('error')
          setMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setMessage('')
            setMessageType('')
          }, 5000)
        })
    }
  }

  const removePerson = id => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Do you want to delete the name and number for ${person.name}?`)){
      personService
      .remove(person.id)
      .then(() => {
        personService
          .getPersons()
          .then(initialPersons => {
            setPersons(initialPersons)
          })
      })
      setMessageType('success'),
          setMessage(`Deleted ${person.name} from the phonebook`),
          setTimeout(() => {
              setMessage('')
              setMessageType('')
            }, 5000)
      }
    }
  
  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value.toLowerCase())
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType}/>
      <Filter handleFilterChange={handleFilterChange}/>
      <h3>Add a new name and number</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handlePersonChange={handlePersonChange} 
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        filteredPersons={filteredPersons} 
        removePerson={removePerson}/>
    </div>
  )
}

export default App