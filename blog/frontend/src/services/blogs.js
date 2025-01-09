import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = newToken
}

const comment = (id, comment) => {
  return axios
    .post(`${baseUrl}/${id}/comments`, { comment: comment })
    .then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const likeById = async id => {
  const request = await axios.post(`${baseUrl}/like/${id}`)
  return request.status
}

const getOne = async blogId => {
  const request = await axios.get(`${baseUrl}/${blogId}`)
  return request.data
}

const create = async user => {
  const request = await axios.post(baseUrl, user, {
    headers: { Authorization: 'Bearer '.concat(token) }
  })
  return request.data
}

const replace = async (blogId, newNote) => {
  const request = await axios.put(`${baseUrl}/${blogId}`, newNote)
  return request.data
}

const remove = async blogId => {
  const request = await axios.delete(`${baseUrl}/${blogId}`, {
    headers: { Authorization: 'Bearer '.concat(token) }
  })
}

export default {
  getAll,
  create,
  setToken,
  replace,
  remove,
  getOne,
  likeById,
  comment
}
