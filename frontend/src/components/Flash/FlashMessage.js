import React from 'react'
import { Message } from 'semantic-ui-react'
import classes from './FlashMessage.module.css'

const FlashMessage = ({ header, message, status }) => {

  const style = status === 'positive' || status === 'negative' ? classes.message : classes.hidden

  return(
    <div className={style}>
      {status === 'positive' ?
        <Message positive>
          <Message.Header>{header}</Message.Header>
          <p>
            {message}
          </p>
        </Message> :
        <Message negative>
          <Message.Header>{header}</Message.Header>
          <p>
            {message}
          </p>
        </Message>
      }
    </div>
  )
}

export default FlashMessage