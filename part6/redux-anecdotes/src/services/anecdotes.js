import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const addOne = async content => {
    const object = {
        content: content,
        votes: 0
    }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const vote = async id => {
    const anecdote = (await axios.get(`${baseUrl}/${id}`)).data
    await axios.put(`${baseUrl}/${id}`, { ...anecdote, votes: anecdote.votes + 1 })
}

export default { getAll, addOne, vote }