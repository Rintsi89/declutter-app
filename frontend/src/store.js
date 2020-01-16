import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import removalReducer from './reducers/removalReducer'
import notificationReducer from './reducers/notificationReducer'
import removalModalReducer from './reducers/removalModalReducer'

const reducer = combineReducers({
  logged_user: userReducer,
  modal: removalModalReducer,
  removals: removalReducer,
  notifications: notificationReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store