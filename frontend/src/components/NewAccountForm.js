import React from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../hooks'
import { loginUser } from '../reducers/userReducer'
import userService from '../services/users'
import classes from '../styles/Form.module.css'

const NewAccountForm = (props) => {
    
const username = useField('text', 'username', 'Username', '')
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
        return alert("Password did not match, try again")
    }

    await userService.create(newUser)
    await props.loginUser(credentials)
    
  } catch (error) {
    // props.showMessage('Wrong user name or password', 'error', 5000)
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
                <Form.Field control={Button}>Create</Form.Field> 
                <p>Already have an account?<button className={classes.buttonlink} onClick={(event) => changeForm(event, 'login')}>Log in</button></p> 
            </div>
        </Form>
    </div>
    )
}

const mapDispatchToProps = {
    loginUser
  }
  
  const ConnectedNewAccountForm = connect(
    null,
    mapDispatchToProps
  )(NewAccountForm)

export default ConnectedNewAccountForm