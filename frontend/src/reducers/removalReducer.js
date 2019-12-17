import removalService from '../services/removals'

const removalReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_REMOVALS':
      return action.data
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

export default removalReducer
