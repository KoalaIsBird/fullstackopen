import { useState, useEffect } from 'react'
import personService from './services/persons'



const PersonForm = ({ handleSubmit, newName, newNumber, handleNameChange, handleNumberChange }) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)


const Persons = ({ includedPersons, deletePersonFun }) => (
  <div>
    {includedPersons.map(person =>
      <div key={person.id}>
        <p>{person.name} {person.number}</p>
        <button onClick={() => deletePersonFun(person)}>delete</button>
      </div>
    )}
  </div>
)


const Filter = ({ searchTerm, handleSearchChange }) => (
  <input value={searchTerm} onChange={handleSearchChange} />
)


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response.data)
      })
  }, [])


  const includedPersons = searchTerm
    ? persons.filter(person => (
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    : persons


  const deletePerson = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(person)
        .then(() => {
          setPersons(persons.filter(p => (p.id !== person.id)))
        })
    }
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    if (!newName || !newNumber) {
      alert(`Please fill in both name and number fields`)
      return
    }

    const presentPerson = persons.find(person => person.name === newName)

    if (!presentPerson) {
      const newPerson = { name: newName, number: newNumber }
      personService
        .addPerson(newPerson)
        .then(response => {
          const newPerson = response.data
          const newPersons = persons.concat(newPerson)
          setPersons(newPersons)
          setNewName('')
          setNewNumber('')
        })
      return
    }

    if (presentPerson.number === newNumber) {
      alert(`This person is already in the notebook with this phone number`)
      return
    }

    if (presentPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = { ...presentPerson, number: newNumber }
        personService
          .changePerson(presentPerson, newPerson)
          .then(p => {
            setPersons(persons.map(p => presentPerson.id === p.id ? newPerson : p))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm handleSubmit={handleSubmit} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons includedPersons={includedPersons} deletePersonFun={deletePerson} />
    </div>
  )
}

export default App