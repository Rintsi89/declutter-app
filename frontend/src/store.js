import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import removalReducer from './reducers/removalReducer'

const reducer = combineReducers({
  logged_user: userReducer,
  removals: removalReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store