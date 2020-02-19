import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { useField } from '../../hooks'
import { showMessage } from '../../reducers/notificationReducer'
import { Button, Form } from 'semantic-ui-react'
import userService from '../../services/users'
import NoAccessPage from '../NoAccessPage/NoAccessPage'
import FlashMessage from '../Flash/FlashMessage'
import classes from './ResetPasswordPage.module.css'

const ResetPasswordPage = (props) => {

  const [user, setUser] = useState(null)
  const password = useField('password', 'password', 'New password', '')
  const retypedpassword = useField('password', 'retypedpassword', 'Retype password', '')

  const userByToken = (token) => userService.checkToken(token)

  useEffect(() => {
    const getUser = async (token) => {
      const foundUser = await userByToken(token)
      setUser(foundUser)
    }
    getUser(props.token)
  }, [])

  const updatePassword = async (event) => {
    event.preventDefault()

    try {

      if (password.attributes.value !== retypedpassword.attributes.value) {
        password.reset()
        retypedpassword.reset()
        return props.showMessage('Password mismatch', 'Check that password is typed correctly.', 'negative')
      }

      const userForReset = {
        username: user.username,
        password: password.attributes.value,
        password2: retypedpassword.attributes.value
      }

      await userService.resetPassword(userForReset)
      props.showMessage('Account reset', 'Your password has been changed. Log in to continue using Declutter App.', 'positive')
      props.history.push('/login')

    } catch (error) {

      props.showMessage('Error', error.response.data.error, 'negative')
      password.reset()
      retypedpassword.reset()
    }
  }

  if (!user) {
    return <NoAccessPage />
  }

  return (
    <div className={classes.main}>
      <FlashMessage header={props.notifications.header} message={props.notifications.message} status={props.notifications.status}/>
      <Form onSubmit={updatePassword} className={classes.form}>
        <h3 className={classes.title}>Reset your password</h3>
        <Form.Field className={classes.formfield}>
          <label><span className={classes.label}>New password</span></label>
          <input {...password.attributes} required />
        </Form.Field>
        <Form.Field className={classes.formfield}>
          <label><span className={classes.label}>Retype password</span></label>
          <input {...retypedpassword.attributes} required />
        </Form.Field>
        <Button positive>Reset</Button>
        <p className={classes.minifooter}>Declutter App 2020</p>
      </Form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  }
}

const mapDispatchToProps = {
  showMessage
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage))