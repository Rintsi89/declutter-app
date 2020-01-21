import React from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { showMessage } from '../reducers/notificationReducer'
import userService from '../services/users'
import classes from '../styles/EditForm.module.css'

const PasswordForm = (props) => {

    const oldPassword = useField('password', 'oldPassword', 'Old password', '')
    const newPassword = useField('password', 'newPassword', 'New password', '')
    const newPasswordRe = useField('password', 'newPassword2', 'Retype new password', '')

    const resetForm = (event) => {
        event.preventDefault()

        oldPassword.reset()
        newPassword.reset()
        newPasswordRe.reset()
        props.setBack(null)
        window.scrollTo(0, 0)
    }

    const changePassword = async (id) => {

        if(newPassword.attributes.value !== newPasswordRe.attributes.value) {
            return alert('New password does not match! Please type again')
        }

        try {
            const updatePassword = {
                password: oldPassword.attributes.value,
                newPassword: newPassword.attributes.value,
                newPassword2: newPasswordRe.attributes.value
            }
    
            props.setBack(null)
            window.scrollTo(0, 0)
            await userService.changePassword(id, updatePassword)
            props.showMessage('Password updated', 'Password was updated successfully', 'positive')
            
        } catch (error) {
            window.scrollTo(0, 0)
            props.showMessage('Error', error.response.data.error, 'negative')
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
                <h3 className={classes.title}>Change your password</h3>
                <Form onSubmit={() => changePassword(props.logged_user.id)}>
                    <Form.Group>
                        <Form.Field width={5}>
                        <label>Old password</label>
                        <input {...oldPassword.attributes} required/>
                        </Form.Field>
                        <Form.Field width={5}>
                        <label>New password</label>
                        <input {...newPassword.attributes} required/>
                        </Form.Field>
                        <Form.Field width={5}>
                        <label>Retype new password</label>
                        <input {...newPasswordRe.attributes} required/>
                        </Form.Field>
                    </Form.Group>
                    <Button.Group>
                        <Button onClick={(event) => resetForm(event)}>Cancel</Button>
                        <Button.Or />
                        <Button primary>Change</Button>
                    </Button.Group>
                </Form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
      notifications: state.notifications
    }
  }

const mapDispatchToProps = {
    showMessage
}

const ConnectedPasswordForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordForm)

export default ConnectedPasswordForm

