import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { useField } from '../hooks'
import { createUser } from '../reducers/userReducer' // Create this and connect!
import classes from '../styles/Form.module.css'

const NewAccountForm = () => {
    
const username = useField('text', 'username')
const name = useField('text', 'name')
const password = useField('password', 'password')
const retypedpassword = useField('password', 'retypedpassword')

const createUser = async (event) => {
  event.preventDefault()

  const newUser = {
      username: username.attributes.value,
      name: name.attributes.value,
      password: password.attributes.value
  }

  try {
    await props.createUser(credentials) // Create this!
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
                <p>Already have an account? <Link to="/">Login</Link></p> 
            </div>
        </Form>
    </div>
    )
}

export default NewAccountForm