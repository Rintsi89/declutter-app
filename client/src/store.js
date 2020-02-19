import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import removalReducer from './reducers/removalReducer'
import notificationReducer from './reducers/notificationReducer'
import removalModalReducer from './reducers/removalModalReducer'
import { loadUser, saveUser } from './localStorage'

const persistedUser = { logged_user: loadUser() }

const reducer = combineReducers({
  logged_user: userReducer,
  modal: removalModalReducer,
  removals: removalReducer,
  notifications: notificationReducer
})

const store = createStore(reducer, persistedUser, applyMiddleware(thunk))

store.subscribe(() => {
  saveUser(store.getState().logged_user)
})

export default store