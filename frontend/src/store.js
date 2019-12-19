import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import loginReducer from './reducers/loginReducer'
import removalReducer from './reducers/removalReducer'
import titleReducer from './reducers/titleReducer'

const reducer = combineReducers({
  logged_user: loginReducer,
  removals: removalReducer,
  title: titleReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store