import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import loginReducer from './reducers/loginReducer'
import removalReducer from './reducers/removalReducer'

const reducer = combineReducers({
  logged_user: loginReducer,
  removals: removalReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store