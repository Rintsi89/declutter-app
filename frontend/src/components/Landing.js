import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import LoginForm from './LoginForm'
import NewAccountForm from './NewAccountForm'
import classes from '../styles/Landing.module.css'

const Landing = () => {
  
  return (
    <div className={classes.landing}>
      <h1 className={classes.maintitle}>Welcome to Declutter App</h1>
        <Router>
            <Route path="/" render={() => <LoginForm />} />
            <Route exact path="/newaccount" render={() => <NewAccountForm />} />
        </Router>
    </div>
  )
}


export default Landing