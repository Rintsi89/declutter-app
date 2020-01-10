import React, { useState } from 'react'
import { connect } from 'react-redux'
import FlashMessage from './Flash/FlashMessage'
import LoginForm from './LoginForm'
import NewAccountForm from './NewAccountForm'
import ResetPassword from './ResetPassword'
import classes from '../styles/Landing.module.css'

const Landing = (props) => {

  const [page, setPage] = useState('login')
  
  return (
    <div className={classes.landing}>
      <h1 className={classes.maintitle}>Welcome to Declutter App</h1>
      <FlashMessage header={props.notifications.header} message={props.notifications.message} status={props.notifications.status}/>
        {page === 'login' ?  <LoginForm setPage={setPage}/> : page === 'reset' ? <ResetPassword setPage={setPage}/> : <NewAccountForm setPage={setPage}/>}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  }
}

export default connect(mapStateToProps, null)(Landing)