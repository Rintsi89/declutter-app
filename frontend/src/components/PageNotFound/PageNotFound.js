import React from 'react'
import { withRouter } from 'react-router'
import classes from './PageNotFound.module.css'

const PageNotFound = (props) => {

  return (
    <div className={classes.main}>
      <h1 className={classes.title}>Page not found!</h1>
      <p className={classes.linkhome}>Go to <button className={classes.buttonlink} onClick={() => props.history.push('/')}>the main page</button></p>
      <p className={classes.minifooter}>Declutter App 2020</p>
    </div>
  )
}

export default withRouter(PageNotFound)