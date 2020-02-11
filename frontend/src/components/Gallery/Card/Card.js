import React from 'react'
import moment from 'moment'
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import classes from './Card.module.css'

const Card = (props) => {

  return (
    <div className={classes.container}>
      <div className={classes.imagecontainer}>
        {props.image ?
          <img src={props.image} className={classes.image} data-cy='image'/>
          :
          <Icon name="image" size='massive'/>
        }
      </div>
      <div className={classes.detailcontainer}>
        <Link to={`/removals/${props.id}`} data-cy='link'>{props.name}</Link>
        <p data-cy='meta'>Created {moment(props.date).format('DD.MM.YYYY')}</p>
      </div>
      <div className={classes.removedcontainer}>
        {props.removed ? <div><Icon color='green' name='checkmark' /> <span data-cy='removed'>Removed</span></div>
          :
          <div><Icon color='red' name='x' /> <span data-cy='notremoved'>Not removed</span></div>}
      </div>
    </div>
  )

}

export default Card