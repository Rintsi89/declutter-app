import loginService from '../services/login'
import userService from '../services/users'
import removalService from '../services/removals'
import { showMessage } from './notificationReducer'
import { initializeRemovals } from './removalReducer'

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
  case 'UPDATE_USER':
    return {
      ...state,
      name: action.data.name,
      username: action.data.username,
      description: action.data.description,
      email: action.data.email
    }
  case 'UPDATE_IMAGE':
    return {
      ...state,
      image: action.data.image
    }
  case 'DELETE_IMAGE':
    return {
      ...state,
      image: action.data.image
    }
  case 'ADD_LOCATION':
    return {
      ...state,
      locations: action.data.locations
    }
  case 'ADD_SALE_LOCATION':
    return {
      ...state,
      saleLocations: action.data.saleLocations
    }
  case 'DELETE_LOCATION':
    return {
      ...state,
      locations: action.data.locations
    }
  case 'DELETE_SALE_LOCATION':
    return {
      ...state,
      saleLocations: action.data.saleLocations
    }
  case 'ADD_CATEGORY':
    return {
      ...state,
      categories: action.data.categories
    }
  case 'DELETE_CATEGORY':
    return {
      ...state,
      categories: action.data.categories
    }
  case 'UNSET_USER':
    return null
  default:
    return state
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    removalService.setToken(user.token)
    userService.setToken(user.token)
    dispatch({
      type: 'SET_USER',
      data: user
    })
    dispatch(initializeRemovals())
    dispatch(showMessage('Logged in', `${user.username} has logged in successfully`, 'positive'))
  }
}

export const logOutUser = () => {
  return async dispatch => {
    dispatch({
      type: 'UNSET_USER'
    })
    dispatch(showMessage('Logged out', 'Log out successfull', 'positive'))
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
    dispatch(showMessage('User updated', `${user.username} was updated successfully`, 'positive'))
  }
}

export const deleteUser = (id, password) => {
  return async dispatch => {
    await userService.deleteUser(id, password)
    dispatch ({
      type: 'UNSET_USER',
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
    dispatch(showMessage('User image updated', ` Image for ${user.username} was updated successfully`, 'positive'))
  }
}

export const deleteImage = (id) => {
  return async dispatch => {
    const user = await userService.deleteImage(id)
    dispatch ({
      type: 'DELETE_IMAGE',
      data: user
    })
    dispatch(showMessage('User image deleted', ` Image for ${user.username} was deleted successfully`, 'positive'))
  }
}

export const addLocation = (id, newLocation) => {
  return async dispatch => {
    const user = await userService.addLocation(id, newLocation)
    dispatch ({
      type: 'ADD_LOCATION',
      data: user
    })
    dispatch(showMessage('Location updated', ` Location ${newLocation.location} added successfully`, 'positive'))
  }
}

export const deleteLocation = (id, location) => {
  return async dispatch => {
    const user = await userService.deleteLocation(id, location)
    dispatch ({
      type: 'DELETE_LOCATION',
      data: user
    })
    dispatch(showMessage('Location deleted', ` Location ${location.location} deleted successfully`, 'positive'))
  }
}

export const addSaleLocation = (id, newSaleLocation) => {
  return async dispatch => {
    const user = await userService.addSaleLocation(id, newSaleLocation)
    dispatch ({
      type: 'ADD_SALE_LOCATION',
      data: user
    })
    dispatch(showMessage('Sale location updated', ` Sale location ${newSaleLocation.value} added successfully`, 'positive'))
  }
}

export const deleteSaleLocation = (id, saleLocation) => {
  return async dispatch => {
    const user = await userService.deleteSaleLocation(id, saleLocation)
    dispatch ({
      type: 'DELETE_SALE_LOCATION',
      data: user
    })
    dispatch(showMessage('Sale location deleted', ` Sale location ${saleLocation.saleLocation} deleted successfully`, 'positive'))
  }
}

export const addCategory = (id, newCategory) => {
  return async dispatch => {
    const user = await userService.addCategory(id, newCategory)
    dispatch ({
      type: 'ADD_CATEGORY',
      data: user
    })
    dispatch(showMessage('Category updated', `Category ${newCategory.value} added successfully`, 'positive'))
  }
}

export const deleteCategory = (id, category) => {
  return async dispatch => {
    const user = await userService.deleteCategory(id, category)
    dispatch ({
      type: 'DELETE_CATEGORY',
      data: user
    })
    dispatch(showMessage('Category deleted', `Category ${category.category} deleted successfully`, 'positive'))
  }
}

export default userReducer