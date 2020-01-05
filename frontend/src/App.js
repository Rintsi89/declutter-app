import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUser } from './reducers/userReducer'
import { initializeRemovals } from './reducers/removalReducer'
import removalService from './services/removals'
import userService from './services/users'
import Landing from './components/Landing'
import Main from './components/Main'
import UserPage from './components/UserPage'
import EditRemoval from './components/EditRemoval'
import {
  BrowserRouter as Router,
  Route, Switch, Redirect
} from 'react-router-dom'

const App = (props) => {

  const removalById = (id) => props.removals.find(r => r.id === id)
  
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
      <Switch>
          <Route exact path="/"><Redirect to='/removals'/></Route>
          <Route exact path="/login" render={() => <Landing />} />
          <Route exact path="/myaccount" render={() => <UserPage />}  />  
          <Route exact path="/removals" render={() => <Main />}/>
          <Route exact path="/removals/:id" render={({ match }) => <EditRemoval removal={removalById(match.params.id)} />} />
      </Switch>
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    logged_user: state.logged_user,
    removals: state.removals
  }
}

const mapDispatchToProps = {
  initializeUser,
  initializeRemovals
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
