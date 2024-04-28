import { useState, useEffect } from 'react'
import axios from 'axios'


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


const Persons = ({ includedPersons }) => (
  <div>
    {includedPersons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
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
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data)
      })
  }, [])


  const includedPersons = searchTerm
    ? persons.filter(person => (
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    : persons


  const handleSubmit = (event) => {
    event.preventDefault()
    if (!newName || !newNumber) {
      alert(`Please fill in both name and number fields`)
      return
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    let newPerson = { name: newName, number: newNumber }
    let newPersons = persons.concat(newPerson)
    setPersons(newPersons)
    setNewName('')
    setNewNumber('')
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
      <Persons includedPersons={includedPersons} />
    </div>
  )
}

export default App