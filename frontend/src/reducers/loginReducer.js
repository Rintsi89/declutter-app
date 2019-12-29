import loginService from '../services/login'
import userService from '../services/users'
import removalService from '../services/removals'

const loginReducer = (state = null, action) => {
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

export default loginReducer