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
  case 'UPDATE_REMOVAL_IMAGE':
    return state.filter(removal => removal.id !== action.data.id).concat(action.data)
  case 'DELETE_REMOVAL_IMAGE':
    return state.filter(removal => removal.id !== action.data.id).concat(action.data)
  case 'DELETE_REMOVAL':
    return state.filter(removal => removal.id !== action.data)
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

export const updateRemovalImage = (id, image) => {
  return async dispatch => {
    const removal = await removalService.updateImage(id, image)
    dispatch ({
      type: 'UPDATE_REMOVAL_IMAGE',
      data: removal
    })
    dispatch(showMessage('Removal image updated', ` Image for ${removal.name} was updated successfully`, 'positive'))
  }
}

export const deleteRemovalImage = (id) => {
  return async dispatch => {
    const removal = await removalService.deleteImage(id)
    dispatch ({
      type: 'DELETE_REMOVAL_IMAGE',
      data: removal
    })
    dispatch(showMessage('Removal image deleted', ` Image for ${removal.name} was deleted successfully`, 'positive'))
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
