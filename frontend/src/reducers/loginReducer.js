import loginService from '../services/login'
import removalService from '../services/removals'

const loginReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
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

export default loginReducer