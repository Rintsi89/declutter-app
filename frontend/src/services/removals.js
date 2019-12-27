import axios from 'axios'
const baseUrl = '/api/removals'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
    const config = {
        headers: { Authorization: token },
      }
      
    const response = await axios.get(baseUrl, config)
    return response.data
  }

const create = async newRemoval => {
  
  const config = {
    headers: { 
      'Content-Type': 'multipart/form-data',
      Authorization: token
     },
  }

  const response = await axios.post(baseUrl, newRemoval, config)
  return response.data
}

const deleteOne = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
} 

export default { setToken, getAll, deleteOne, create }