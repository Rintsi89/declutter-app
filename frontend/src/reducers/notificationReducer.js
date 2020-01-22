const notificationReducer = (state = [], action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      header: action.header,
      message: action.message,
      status: action.status
    }
  case 'HIDE_NOTIFICATION':
    return []
  default:
    return state
  }
}

export const changeMessage = message => {
  return {
    type: 'SET_MESSAGE',
    message
  }
}

export const hideMessage = () => {
  return {
    type: 'HIDE_MESSAGE'
  }
}

export const showMessage = (header, message, status) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      header: header,
      message: message,
      status: status
    })
    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
    }, 5000)
  }
}

export default notificationReducer