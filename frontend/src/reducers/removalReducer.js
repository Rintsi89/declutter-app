import removalService from '../services/removals'
import { showMessage } from './notificationReducer'

const removalReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_REMOVALS':
      return action.data
    case 'NEW_REMOVAL':
      return state.concat(action.data)
    case 'UPDATE_REMOVAL':
      return state.filter(removal => removal.id !== action.data.id).concat(action.data)
    case 'UPDATE_IMAGE':
      return state.filter(removal => removal.id !== action.data.id).concat(action.data)
    case 'DELETE_IMAGE':
      return state.filter(removal => removal.id !== action.data.id).concat(action.data)
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
    dispatch(showMessage('Removal created', `${newRemoval.name} was created successfully`, 'positive'))
  }
}

export const updateRemoval = (id, removalObject) => {
  return async dispatch => {
    const removal = await removalService.update(id, removalObject)
    dispatch ({
      type: 'UPDATE_REMOVAL',
      data: removal
    })
    dispatch(showMessage('Removal updated', `${removal.name} was updated successfully`, 'positive'))
  }
}

export const updateImage = (id, image) => {
  return async dispatch => {
    const removal = await removalService.updateImage(id, image)
    dispatch ({
      type: 'UPDATE_IMAGE',
      data: removal
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

export const deleteRemoval = (id, name) => {
  return async dispatch => {
    await removalService.deleteOne(id)
    dispatch({
      type: 'DELETE_REMOVAL',
      data: id
    })
    dispatch(showMessage('Removal deleted', `${name} was deleted successfully`, 'positive'))
  }
}

export default removalReducer
