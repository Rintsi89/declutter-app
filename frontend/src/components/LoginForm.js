import React from 'react'
import { connect } from 'react-redux' 
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../hooks'
import { loginUser } from '../reducers/userReducer'
import classes from '../styles/Form.module.css'

const LoginForm = (props) => {

const username = useField('text', 'username', 'Username', '')
const password = useField('password', 'password', 'Password', '')

const changeForm = (event, formName) => {
  event.preventDefault()
  props.setPage(formName)
}

const handleLogin = async (event) => {
  event.preventDefault()

  const credentials = {
    username: username.attributes.value,
    password: password.attributes.value
  }

  try {
    await props.loginUser(credentials)
  } catch (error) {
    // props.showMessage('Wrong user name or password', 'error', 5000)
    username.reset()
    password.reset()
  }
}
return (
    <div>
        <Form onSubmit={handleLogin} className={classes.form}>
            <div className={classes.formfield}>
            <h3>Log In</h3>
            <i>Type your username and password to log in</i>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Username</label>
                    <input {...username.attributes}></input>
                </Form.Field>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Password</label>
                    <input {...password.attributes}></input>
                </Form.Field>
            </div>
            <div className={classes.formfield}>
                <Button positive>Log In</Button> 
                <p>No account yet?<button className={classes.buttonlink} onClick={(event) => changeForm(event, 'newaccount')}>Create account</button></p> 
            </div>
        </Form>
    </div>
    )
}

const mapDispatchToProps = {
    loginUser
  }
  
  const ConnectedLoginForm = connect(
    null,
    mapDispatchToProps
  )(LoginForm)

  export default ConnectedLoginForm
  