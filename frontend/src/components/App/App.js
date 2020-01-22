import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUser } from '../../reducers/userReducer'
import { initializeRemovals } from '../../reducers/removalReducer'
import removalService from '../../services/removals'
import userService from '../../services/users'
import Landing from '../Landing/Landing'
import Header from '../Header/Header'
import Main from '../Main/Main'
import UserPage from '../UserPage/UserPage'
import Gallery from '../Gallery/Gallery'
import RemovalPage from '../RemovalPage/RemovalPage'
import ResetPasswordPage from '../ResetPasswordPage/ResetPasswordPage'
import {
  BrowserRouter as Router,
  Route, Switch, Redirect
} from 'react-router-dom'
import classes from './App.module.css'

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
        <Route exact path="/reset/:token" render={({ match }) => <ResetPasswordPage token={match.params.token} />}  />
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
          <Route exact path="/removals/:id" render={({ match }) => <RemovalPage removal={removalById(match.params.id)} />} />
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
