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

const update = async (id, updatedRemoval) => {

  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.patch(`${baseUrl}/${id}`, updatedRemoval, config)
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

const updateImage = async (id, updatedRemoval) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.patch(`${baseUrl}/${id}/picture/add`, updatedRemoval, config)
  return response.data
}

const deleteImage = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/picture/remove`, null, config)
  return response.data
}


export default {
  setToken,
  getAll,
  deleteImage,
  deleteOne,
  create,
  update,
  updateImage
}