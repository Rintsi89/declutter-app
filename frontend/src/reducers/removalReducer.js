import removalService from '../services/removals'
import { loadPartialConfig } from '@babel/core'

const removalReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_REMOVALS':
      return action.data
    case 'NEW_REMOVAL':
      return state.concat(action.data)
    case 'DELETE_IMAGE':
      const newArray = state.filter(removal => removal.id !== action.data.id)
      newArray.concat(action.data)
      return newArray
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

export const createRemoval = (data) => {
  return async dispatch => {
    const newRemoval = await removalService.create(data)
    dispatch({
      type: 'NEW_REMOVAL',
      data: newRemoval
    })
  }
}

export const deleteImage = (id) => {
  return async dispatch => {
    const removal = await removalService.deleteImage(id)
    dispatch ({
      type: 'DELETE_IMAGE',
      data: removal
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
