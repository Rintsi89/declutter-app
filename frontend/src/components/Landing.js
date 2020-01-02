import React, { useState } from 'react'
import LoginForm from './LoginForm'
import NewAccountForm from './NewAccountForm'
import classes from '../styles/Landing.module.css'

const Landing = () => {

  const [page, setPage] = useState('login')
  
  return (
    <div className={classes.landing}>
      <h1 className={classes.maintitle}>Welcome to Declutter App</h1>
        {page === 'login' ?  <LoginForm setPage={setPage}/> : <NewAccountForm setPage={setPage}/>}
    </div>
  )
}


export default Landing