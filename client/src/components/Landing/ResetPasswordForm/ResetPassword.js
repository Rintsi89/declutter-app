import React from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../../../hooks'
import { showMessage } from '../../../reducers/notificationReducer'
import { loginUser } from '../../../reducers/userReducer'
import userService from '../../../services/users'
import classes from './ResetPasswordForm.module.css'

const ResetPasswordForm = (props) => {

  const email = useField('email', 'email', 'Email', '')

  const changeForm = (event, formName) => {
    event.preventDefault()
    props.setPage(formName)
  }

  const sendEmail = async (event) => {
    event.preventDefault()

    try {

      if (!email.attributes.value) {
        return props.showMessage('Error', 'Email can\'t be blank','negative')
      }

      const response = await userService.forgotPassword({ email: email.attributes.value })
      props.showMessage('Email sent', `${response.message}`, 'positive')
      email.reset()


    } catch (error) {
      props.showMessage('Error', error.response.data.error, 'negative')
      email.reset()
    }
  }

  return (
    <div>
      <Form className={classes.form} onSubmit={sendEmail}>
        <div className={classes.formfield}>
          <h3 className={classes.title}>Reset password</h3>
          <i>Type your email address</i>
        </div>
        <Form.Field className={classes.formfield}>
          <label>Email</label>
          <input {...email.attributes} data-cy='email' />
        </Form.Field>
        <div className={classes.submitfield}>
          <Button positive>Send email</Button>
          <p><span className={classes.text}>Already have an account?</span><button className={classes.buttonlink} onClick={(event) => changeForm(event, 'login')}>Log in</button></p>
          <p><span className={classes.text}>No account yet?</span><button className={classes.buttonlink} onClick={(event) => changeForm(event, 'newaccount')}>Create account</button></p>
        </div>
      </Form>
    </div>
  )
}

const mapDispatchToProps = {
  loginUser,
  showMessage
}

const ConnectedResetPasswordForm = connect(
  null,
  mapDispatchToProps
)(ResetPasswordForm)

export default ConnectedResetPasswordForm