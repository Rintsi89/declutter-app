import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUser } from '../../reducers/userReducer'
import { initializeRemovals } from '../../reducers/removalReducer'
import removalService from '../../services/removals'
import userService from '../../services/users'
import Landing from '../Landing/Landing'
import Main from '../Main/Main'
import UserPage from '../UserPage/UserPage'
import Gallery from '../Gallery/Gallery'
import RemovalPage from '../RemovalPage/RemovalPage'
import ResetPasswordPage from '../ResetPasswordPage/ResetPasswordPage'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import PageNotFound from '../PageNotFound/PageNotFound'
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

  return (
    <div className={classes.main}>
      <Router>
        <Switch>
          <Route exact path="/"><Redirect to='/removals' /></Route>
          <Route exact path="/login" render={() => <Landing />}  />
          <Route exact path="/reset/:token" render={({ match }) => <ResetPasswordPage token={match.params.token} />} />
          <ProtectedRoute exact path="/myaccount" user={props.logged_user} component={UserPage} />
          <ProtectedRoute exact path="/gallery" user={props.logged_user} component={Gallery}  />
          <ProtectedRoute exact path="/removals" user={props.logged_user} component={Main} />
          <ProtectedRoute exact path="/removals/:id" user={props.logged_user} component={({ match }) => <RemovalPage removal={removalById(match.params.id)} />} />
          <Route exact path='*' component={PageNotFound} />
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
