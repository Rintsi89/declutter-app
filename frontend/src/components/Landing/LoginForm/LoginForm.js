import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../../../hooks'
import { showMessage } from '../../../reducers/notificationReducer'
import { loginUser } from '../../../reducers/userReducer'
import classes from './LoginForm.module.css'

const LoginForm = (props) => {

  const username = useField('text', 'username', 'Username', '')
  const password = useField('password', 'password', 'Password', '')

  const changeForm = (event, formName) => {
    event.preventDefault()
    props.setPage(formName)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!username.attributes.value) {
      return props.showMessage('Error', 'Username can\'t be blank','negative')
    }

    if (!password.attributes.value) {
      return props.showMessage('Error', 'Password can\'t be blank','negative')
    }

    const credentials = {
      username: username.attributes.value,
      password: password.attributes.value
    }

    try {
      await props.loginUser(credentials)
      props.history.push('/removals')
    } catch (error) {
      props.showMessage('Error', error.response.data.error, 'negative')
      username.reset()
      password.reset()
    }
  }
  return (
    <div>
      <Form onSubmit={handleLogin} className={classes.form}>
        <div className={classes.formfield}>
          <h3 className={classes.title}>Log In</h3>
        </div>
        <Form.Field className={classes.formfield}>
          <label>Username</label>
          <input {...username.attributes} data-cy="username"/>
        </Form.Field>
        <Form.Field className={classes.formfield}>
          <label>Password</label>
          <input {...password.attributes} data-cy="password"/>
        </Form.Field>
        <div className={classes.submitfield}>
          <Button positive data-cy="login">Log In</Button>
          <p><span className={classes.text}>No account yet?</span><button className={classes.buttonlink} onClick={(event) => changeForm(event, 'newaccount')}>Create account</button></p>
          <p><span className={classes.text}>Forgot your password?</span><button className={classes.buttonlink} onClick={(event) => changeForm(event, 'reset')}>Reset password</button></p>
        </div>
      </Form>
    </div>
  )
}

const mapDispatchToProps = {
  loginUser,
  showMessage
}

const ConnectedLoginForm = connect(
  null,
  mapDispatchToProps
)(LoginForm)

export default withRouter(ConnectedLoginForm)
