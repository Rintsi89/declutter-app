import React from 'react'
import { connect } from 'react-redux' 
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../hooks'
import { showMessage } from '../reducers/notificationReducer'
import { loginUser } from '../reducers/userReducer'
import userService from '../services/users'
import classes from '../styles/Form.module.css'

const LoginForm = (props) => {

const email = useField('email', 'email', 'Email', '')

const changeForm = (event, formName) => {
  event.preventDefault()
  props.setPage(formName)
}

const sendEmail = async (event) => {
  event.preventDefault()

  try {
    await userService.forgotPassword({ email: email.attributes.value })
  } catch (error) {
    props.showMessage('Error', error.response.data.error, 'negative')
    username.reset()
    password.reset()
  }
}

return (
    <div>
        <Form className={classes.form} onSubmit={sendEmail}>
            <div className={classes.formfield}>
            <h3>Reset password</h3>
            <i>Type your email to reset password</i>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Email</label>
                    <input {...email.attributes} required></input>
                </Form.Field>
            </div>
            <div className={classes.formfield}>
                <Button positive>Reset</Button> 
                <p>Already have an account?<button className={classes.buttonlink} onClick={(event) => changeForm(event, 'login')}>Log in</button></p> 
                <p>No account yet?<button className={classes.buttonlink} onClick={(event) => changeForm(event, 'newaccount')}>Create account</button></p> 
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

  export default ConnectedLoginForm