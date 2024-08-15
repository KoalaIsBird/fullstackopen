import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = newToken
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (user) => {
  const request = await axios.post(
    baseUrl,
    user,
    { headers: { 'Authorization': 'Bearer '.concat(token) } }
  )
  return request.data
}

const replace = async (blogId, newNote) => {
  const request = await axios.put(
    `${baseUrl}/${blogId}`,
    newNote
  )
  return request.data
}

const remove = async blogId => {
  const request = await axios.delete(
    `${baseUrl}/${blogId}`,
    { headers: { 'Authorization': 'Bearer '.concat(token) } })
}

export default { getAll, create, setToken, replace, remove }