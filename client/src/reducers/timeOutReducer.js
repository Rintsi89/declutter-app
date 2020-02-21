const timeOutReducer = (state = [], action) => {
    switch (action.type) {
    case 'SET_TIMEOUT_ID':
      return action.id
    case 'UNSET_TIMEOUT_ID':
      return []
    default:
      return state
    }
  }

  export const unsetTimeOut = (id) => {
    window.clearTimeout(id)
    return async dispatch => {
      dispatch({
        type: 'HIDE_NOTIFICATION'
      })
      dispatch({
        type: 'UNSET_TIMEOUT_ID'
      })
  }
}
  
  export default timeOutReducer