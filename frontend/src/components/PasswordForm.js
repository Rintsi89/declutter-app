import React from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import userService from '../services/users'
import { useField } from '../hooks'
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
    }

    const changePassword = (id) => {

        if(newPassword.attributes.value !== newPasswordRe.attributes.value) {
            return alert('New password does not match! Please type again')
        }

        const updatePassword = {
            password: oldPassword.attributes.value,
            newPassword: newPassword.attributes.value,
            newPassword2: newPasswordRe.attributes.value
        }

        userService.changePassword(id, updatePassword)
        oldPassword.reset()
        newPassword.reset()
        newPasswordRe.reset()
    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
                <h2>Change your password</h2>
                <Form onSubmit={() => changePassword(props.logged_user.id)}>
                    <Form.Group>
                        <Form.Field width={5}>
                        <label>Old password</label>
                        <input {...oldPassword.attributes} />
                        </Form.Field>
                        <Form.Field width={5}>
                        <label>New password</label>
                        <input {...newPassword.attributes} />
                        </Form.Field>
                        <Form.Field width={5}>
                        <label>Retype new password</label>
                        <input {...newPasswordRe.attributes} />
                        </Form.Field>
                    </Form.Group>
                    <Button.Group>
                        <Button onClick={(event) => resetForm(event)}>Cancel</Button>
                        <Button.Or />
                        <Button positive>Change</Button>
                    </Button.Group>
                </Form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
    }
  }


const ConnectedPasswordForm= connect(
    mapStateToProps,
    null
)(PasswordForm)

export default ConnectedPasswordForm

