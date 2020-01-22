import React from 'react'
import classes from './Title.module.css'

const Title = ({ title }) => {

  return (
    <div className={classes.maintitle}>
      <h2 className={classes.mainh2}>{title}</h2>
    </div>
  )
}

export default Title