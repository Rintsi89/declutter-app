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

const createExcel = async () => {
  const config = {
      headers: { Authorization: token },
    }
    
  await axios.get(`${baseUrl}/excel`, config)
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

const deleteImage = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  
  const response = await axios.delete(`${baseUrl}/${id}/picture/remove`, config)
  return response.data
}


export default {
  setToken,
  getAll,
  deleteImage,
  deleteOne,
  create,
  createExcel }