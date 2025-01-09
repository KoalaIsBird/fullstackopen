import axios from 'axios'

const baseUrl = '/api/users'

const getUsers = async () => {
  const users = await axios.get(baseUrl)
  return users.data
}

const getUser = async id => {
  const user = await axios.get(`${baseUrl}/${id}`)
  return user.data
}

const create = async (username, name, password) => {
  console.log()
  const user = await axios.post(baseUrl, { username, name, password })
  return user.data
}

export default { getUsers, getUser, create }
