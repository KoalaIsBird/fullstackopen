import axios from 'axios'
const url = 'http://localhost:3001/persons'


const getAll = () => {
    return axios.get(url)
}


const addPerson = (person) => {
    return axios.post(url, person)
}

const deletePerson = (person) => {
    return axios.delete(`${url}/${person.id}`)
}

const changePerson = (person, newPerson) => { 
    return axios.put(`${url}/${person.id}`, newPerson)
}


export default { getAll, addPerson, deletePerson, changePerson }

