import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { Button, Form, ButtonGroup } from 'semantic-ui-react'
import { deleteUser, logOutUser } from '../reducers/userReducer'
import { showMessage } from '../reducers/notificationReducer'
import { useField } from '../hooks'
import classes from '../styles/EditForm.module.css'

const DeleteAccountPage = (props) => {

    const password = useField('password', 'password', 'Password', '')

    const resetForm = (event) => {
        event.preventDefault()

        password.reset()
        props.setBack(null)
        window.scrollTo(0, 0)
    }

    const logOut = () => {
        // This a controversial solution to redirecting but it does the job
        props.history.push('/login')
        location.reload()
    }

    const deleteUser = async (id) => {

        if(confirm('Are you sure you want to delete your account? This action is permanent'))

        try {
            const passwordToSend = { password: password.attributes.value } 
            await props.deleteUser(id, passwordToSend)
            logOut()
        } catch (error) {
            window.scrollTo(0, 0)
            props.showMessage('Error', error.response.data.error, 'negative')
        }

    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
                <h3 className={classes.title}>Delete your account</h3>
                <p><em><b>If you delete your account, you are unable to restore your data</b></em></p>
                <Form onSubmit={() => deleteUser(props.logged_user.id)}>
                    <Form.Group>
                        <Form.Field>
                            <label>Password</label>
                            <input {...password.attributes} />
                        </Form.Field>
                    </Form.Group>
                    <ButtonGroup>
                        <Button onClick={(event) => resetForm(event)}>Cancel</Button>
                            <Button.Or />
                        <Button negative>Delete account</Button>
                    </ButtonGroup>
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
    deleteUser,
    logOutUser,
    showMessage
 }


const ConnectedDeleteAccountPage= connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteAccountPage)

export default withRouter(ConnectedDeleteAccountPage)