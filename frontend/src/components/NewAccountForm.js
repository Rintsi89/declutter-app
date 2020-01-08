import React from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../hooks'
import { loginUser } from '../reducers/userReducer'
import { showMessage } from '../reducers/notificationReducer'
import userService from '../services/users'
import classes from '../styles/Form.module.css'

const NewAccountForm = (props) => {
    
const username = useField('text', 'username', 'Username', '', true)
const name = useField('text', 'name', 'Name', '')
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
      name: name.attributes.value,
      password: password.attributes.value
  }

  const credentials = {
    username: username.attributes.value,
    password: password.attributes.value
  }

  try {

    if (password.attributes.value !== retypedpassword.attributes.value) {
        password.reset()
        retypedpassword.reset()
        return props.showMessage('Password mismatch', 'Check that password is typed correctly ', 'negative')
    }

    await userService.create(newUser)
    await props.loginUser(credentials)
    
  } catch (error) {     

    props.showMessage('Error', error.response.data.error, 'negative')
    username.reset()
    password.reset()
    retypedpassword.reset()
    name.reset()
  }
}
return (
    <div>
        <Form onSubmit={createUser} className={classes.form}>
            <div className={classes.formfield}>
            <h3>Create user account</h3>
            <i>Fill in the form to create new account</i>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Username</label>
                    <input {...username.attributes}></input>
                </Form.Field>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Name</label>
                    <input {...name.attributes}></input>
                </Form.Field>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Password</label>
                    <input {...password.attributes}></input>
                </Form.Field>
            </div>
            <div>
                <Form.Field className={classes.formfield}>
                    <label>Retype password</label>
                    <input {...retypedpassword.attributes}></input>
                </Form.Field>
            </div>
            <div className={classes.formfield}>
                <Button positive>Create</Button>  
                <p>Already have an account?<button className={classes.buttonlink} onClick={(event) => changeForm(event, 'login')}>Log in</button></p> 
            </div>
        </Form>
    </div>
    )
}

const mapDispatchToProps = {
    loginUser,
    showMessage
  }
  
  const ConnectedNewAccountForm = connect(
    null,
    mapDispatchToProps
  )(NewAccountForm)

export default ConnectedNewAccountForm