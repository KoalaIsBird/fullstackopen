import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (user, token) => {
  const request = await axios.post(
    baseUrl,
    user,
    { headers: { 'Authorization': 'Bearer '.concat(token) } }
  )
  return request.data
}

export default { getAll, create }