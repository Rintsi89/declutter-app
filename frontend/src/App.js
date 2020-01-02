import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { initializeUser } from './reducers/userReducer'
import { initializeRemovals } from './reducers/removalReducer'
import removalService from './services/removals'
import userService from './services/users'
import Landing from './components/Landing'
import Main from './components/Main'
import UserPage from './components/UserPage'
import {
  BrowserRouter as Router,
  Route, Redirect
} from 'react-router-dom'

const App = (props) => {
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.initializeUser(user)
      removalService.setToken(user.token)
      userService.setToken(user.token)
      props.initializeRemovals()
    }
  }, [])

  if (!props.logged_user) {
    return <Landing />
  }

  return (
    <div>
      <Router>
          <Route exact path="/" render={() => <Main />}/>
          <Route exact path="/login" render={() => <Landing />} />
          <Route exact path="/myaccount" render={() => <UserPage />}  /> 
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    logged_user: state.logged_user
  }
}

const mapDispatchToProps = {
  initializeUser,
  initializeRemovals
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
