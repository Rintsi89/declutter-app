
const removalModalReducer = (state = [], action) => {
  switch (action.type) {
  case 'SHOW_MODAL':
    return { removal: action.data, visible: true }
  case 'HIDE_MODAL':
    return { removal: null, visible: false }
  default:
    return state
  }
}

export const initModal = (removal) => {
  return {
    type: 'SHOW_MODAL',
    data: removal
  }
}

export const hideModal = () => {
  return {
    type: 'HIDE_MODAL'
  }
}

export default removalModalReducer
