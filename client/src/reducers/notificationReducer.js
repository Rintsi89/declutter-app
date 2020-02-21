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
    const timeOut = setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
      dispatch({
        type: 'UNSET_TIMEOUT_ID'
      })
    }, 5000)
    dispatch({
      type: 'SET_TIMEOUT_ID',
      id: timeOut
    })
  }
}

export default notificationReducer