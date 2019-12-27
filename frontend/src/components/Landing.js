import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import LoginForm from './LoginForm'
import NewAccountForm from './NewAccountForm'
import classes from '../styles/Form.module.css'

const Landing = () => {
  
  return (
    <div>
      <h2 className={classes.maintitle}>Welcome to Declutter App</h2>
        <Router>
            <Route exact path="/" render={() => <LoginForm />} />
            <Route exact path="/newaccount" render={() => <NewAccountForm />} />
        </Router>
    </div>
  )
}


export default Landing