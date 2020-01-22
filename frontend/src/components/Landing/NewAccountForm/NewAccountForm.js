import React from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../../../hooks'
import { showMessage } from '../../../reducers/notificationReducer'
import userService from '../../../services/users'
import classes from './NewAccountForm.module.css'

const NewAccountForm = (props) => {

  const username = useField('text', 'username', 'Username', '', true)
  const email = useField('email', 'email', 'Email', '')
  const password = useField('password', 'password', 'Password', '')
  const retypedpassword = useField('password', 'retypedpassword', 'Retype password', '')

  const changeForm = (event, formName) => {
    event.preventDefault()
    props.setPage(formName)
  }

  const createUser = async (event) => {
    event.preventDefault()

    const newUser = {
      username: username.attributes.value,
      email: email.attributes.value,
      password: password.attributes.value
    }

    try {

      if (password.attributes.value !== retypedpassword.attributes.value) {
        password.reset()
        retypedpassword.reset()
        return props.showMessage('Password mismatch', 'Check that password is typed correctly ', 'negative')
      }

      await userService.create(newUser)
      props.showMessage('Verification email sent', `Verification email has been send to ${email.attributes.value}. Please verify your account and log in`, 'positive')
      username.reset()
      password.reset()
      retypedpassword.reset()
      email.reset()

    } catch (error) {

      props.showMessage('Error', error.response.data.error, 'negative')
      username.reset()
      password.reset()
      retypedpassword.reset()
      email.reset()
    }
  }
  return (
    <div>
      <Form onSubmit={createUser} className={classes.form}>
        <div className={classes.formfield}>
          <h3 className={classes.title}>Create user account</h3>
          <i>Fill in the form to create new account</i>
        </div>
        <Form.Field className={classes.formfield}>
          <label>Username</label>
          <input {...username.attributes} required />
        </Form.Field>
        <Form.Field className={classes.formfield}>
          <label>Email</label>
          <input {...email.attributes} required />
        </Form.Field>
        <Form.Field className={classes.formfield}>
          <label>Password</label>
          <input {...password.attributes} />
        </Form.Field>
        <Form.Field className={classes.formfield}>
          <label>Retype password</label>
          <input {...retypedpassword.attributes} />
        </Form.Field>
        <div className={classes.submitfield}>
          <Button positive>Create</Button>
          <p><span className={classes.text}>Already have an account?</span><button className={classes.buttonlink} onClick={(event) => changeForm(event, 'login')}>Log in</button></p>
          <p><span className={classes.text}>Forgot your password?</span><button className={classes.buttonlink} onClick={(event) => changeForm(event, 'reset')}>Reset password</button></p>
        </div>
      </Form>
    </div>
  )
}

const mapDispatchToProps = {
  showMessage
}

const ConnectedNewAccountForm = connect(
  null,
  mapDispatchToProps
)(NewAccountForm)

export default ConnectedNewAccountForm