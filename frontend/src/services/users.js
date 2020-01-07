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
const deleteUser = async (id, password) => {
  const config = {
    headers: { Authorization: token }
  }
  
  const response = await axios.put(`${baseUrl}/${id}/delete`, password, config)
  return response.data
}

const updateImage = async (id, updatedUser) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}/picture/add`, updatedUser, config)
  return response.data
}

const deleteImage = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  
  const response = await axios.delete(`${baseUrl}/${id}/picture/remove`, config)
  return response.data
}

const addLocation = async (id, newLocation) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/locations/add`, newLocation, config)
  return response.data
}

const deleteLocation = async (id, location) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/locations/remove`, location, config)
  return response.data
}

const addSaleLocation = async (id, newSaleLocation) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/salelocations/add`, newSaleLocation, config)
  return response.data
}

const deleteSaleLocation = async (id, saleLocation) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/salelocations/remove`, saleLocation, config)
  return response.data
}

const changePassword = async (id, newPassword) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}/password`, newPassword, config)
  return response.data
}

const addCategory = async (id, newCategory) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/categories/add`, newCategory, config)
  return response.data
}

const deleteCategory = async (id, category) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}/categories/remove`, category, config)
  return response.data
}


export default { 
  setToken, 
  create,
  update,
  deleteUser,
  updateImage,
  deleteImage,
  addLocation,
  deleteLocation,
  addSaleLocation,
  deleteSaleLocation,
  changePassword,
  addCategory,
  deleteCategory  
}