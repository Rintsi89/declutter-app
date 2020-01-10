import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { useField } from '../hooks'
import { showMessage } from '../reducers/notificationReducer'
import { Button, Form } from 'semantic-ui-react'
import userService from '../services/users'
import FlashMessage from './Flash/FlashMessage'

const PasswordResetForm = (props) => {

    const [user, setUser] = useState(null)
    const password = useField('password', 'password', 'Password', '')
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
        // Add here standard template for errors, remember to make!
        return <h3>You dont have access to be here!</h3>
    }

return (
    <div>
         <FlashMessage header={props.notifications.header} message={props.notifications.message} status={props.notifications.status}/>
        <Form onSubmit={updatePassword}>
            <h3>Reset your password</h3>
            <i>Type new password</i>
            <div>
                <Form.Field>
                    <label>Password</label>
                    <input {...password.attributes} required></input>
                </Form.Field>
            </div>
            <div>
                <Form.Field>
                    <label>Retype password</label>
                    <input {...retypedpassword.attributes} required></input>
                </Form.Field>
            </div>
            <Button positive>Change</Button>  
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
  

  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordResetForm))