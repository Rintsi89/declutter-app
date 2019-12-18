import removalService from '../services/removals'

const removalReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_REMOVALS':
      return action.data
    case 'DELETE_REMOVAL':
      const removalToDelete = action.data
      return state.filter(removal => removal.id !== removalToDelete)
    default:
      return state
    }
  }

export const initializeRemovals = () => {
    return async dispatch => {
        const removals = await removalService.getAll()
        dispatch({
            type: 'INIT_REMOVALS',
            data: removals
        })
    }
}

export const deleteRemoval = (id) => {
  return async dispatch => {
    await removalService.deleteOne(id)
    dispatch({
      type: 'DELETE_REMOVAL',
      data: id
    })
  }
}

export default removalReducer
