import React from 'react'
import { Icon } from 'semantic-ui-react'
import classes from './Title.module.css'

const Title = ({ title }) => {

  const icon = title === 'My removals' ? 'money bill alternate outline' : title === 'My account' ? 'user outline' : title === 'My gallery' ? 'images outline' : 'box'

  return (
    <div className={classes.maintitle}>
      <h2 className={classes.mainh2}><Icon name={icon} size='small' className={classes.icon}/> {title}</h2>
    </div>
  )
}

export default Title