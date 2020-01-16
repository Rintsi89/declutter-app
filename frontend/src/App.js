import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUser } from './reducers/userReducer'
import { initializeRemovals } from './reducers/removalReducer'
import removalService from './services/removals'
import userService from './services/users'
import Landing from './components/Landing'
import Header from './components/Header'
import Main from './components/Main'
import UserPage from './components/UserPage'
import Gallery from './components/Gallery'
import EditRemoval from './components/EditRemoval'
import PasswordResetForm from './components/PasswordResetForm'
import {
  BrowserRouter as Router,
  Route, Switch, Redirect
} from 'react-router-dom'
import classes from './styles/App.module.css'

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
    return (
    <Router>
      <Route exact path="/" render={() => <Landing />}  />
      <Route exact path="/login" render={() => <Landing />}  />
      <Route exact path="/reset/:token" render={({ match }) => <PasswordResetForm token={match.params.token} />}  /> 
    </Router>
    )
  }

  return (
    <div className={classes.main}>
      <Router>
        
          <Header />
          {/* This add extra spacer after fixed header so elements underneath it can refer their margins to this */}
          <div className={classes.spacer}>
              &nbsp;
          </div>
          <Switch>
              <Route exact path="/"><Redirect to='/removals'/></Route>
              <Route exact path="/myaccount" render={() => <UserPage />}  />  
              <Route exact path="/gallery" render={() => <Gallery />}  />  
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
    removals: state.removals,
    notifications: state.notifications
  }
}

const mapDispatchToProps = {
  initializeUser,
  initializeRemovals
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
