import loginService from '../services/login'
import userService from '../services/users'
import removalService from '../services/removals'

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
  case 'UPDATE_USER':
    const updatedUser = {
      ...state,
      name: action.data.name,
      username: action.data.username,
      description: action.data.description
    }
    window.localStorage.setItem('loggedUser', JSON.stringify(updatedUser))
    return updatedUser
  case 'UPDATE_IMAGE':
    const updatedUserWithImage = {
      ...state,
      image: action.data.image
    }
    window.localStorage.setItem('loggedUser', JSON.stringify(updatedUserWithImage))
    return updatedUserWithImage 
  case 'DELETE_IMAGE':
    const updatedUserNoImage = {
      ...state,
      image: action.data.image
    }
    window.localStorage.setItem('loggedUser', JSON.stringify(updatedUserNoImage))
    return updatedUserNoImage
  case 'ADD_LOCATION':
    const updatedUserWithNewLocation = {
      ...state,
      locations: action.data.locations
    }
    window.localStorage.setItem('loggedUser', JSON.stringify(updatedUserWithNewLocation))
    return updatedUserWithNewLocation
  case 'DELETE_LOCATION':
    const updatedUserWithDeletedLocation = {
      ...state,
      locations: action.data.locations
    }
    window.localStorage.setItem('loggedUser', JSON.stringify(updatedUserWithDeletedLocation))
    return updatedUserWithDeletedLocation
  case 'UNSET_USER':
  return null  
  default:
    return state
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedUser', JSON.stringify(user))
    removalService.setToken(user.token)
    userService.setToken(user.token)
    dispatch({
      type: 'SET_USER',
      data: user
    })
  }
}

export const logOutUser = () => {
  return {
    type: 'UNSET_USER'
  }
}

export const initializeUser = (user) => {
  return {
    type: 'SET_USER',
    data: user
  }
}

export const updateUser = (id, userObject) => {
  return async dispatch => {
    const user = await userService.update(id, userObject)
    dispatch ({
      type: 'UPDATE_USER',
      data: user
    })
  }
}

export const updateImage = (id, image) => {
  return async dispatch => {
    const user = await userService.updateImage(id, image)
    dispatch ({
      type: 'UPDATE_IMAGE',
      data: user
    })
  }
}

export const deleteImage = (id) => {
  return async dispatch => {
    const user = await userService.deleteImage(id)
    dispatch ({
      type: 'DELETE_IMAGE',
      data: user
    })
  }
}

export const addLocation = (id, newLocation) => {
  return async dispatch => {
    const user = await userService.addLocation(id, newLocation)
    dispatch ({
      type: 'ADD_LOCATION',
      data: user
    })
  }
}

export const deleteLocation = (id, location) => {
  return async dispatch => {
    const user = await userService.deleteLocation(id, location)
    dispatch ({
      type: 'DELETE_LOCATION',
      data: user
    })
  }
}

export default userReducer