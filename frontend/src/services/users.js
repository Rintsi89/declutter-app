import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newUser => {

  const response = await axios.post(baseUrl, newUser)
  return response.data
}

const update = async (id, updatedUser) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.patch(`${baseUrl}/${id}`, updatedUser, config)
  return response.data
}

export default { setToken, create, update }