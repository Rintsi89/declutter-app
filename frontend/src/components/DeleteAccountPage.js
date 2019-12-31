import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, ButtonGroup } from 'semantic-ui-react'
import { deleteUser } from '../reducers/userReducer'
import { useField } from '../hooks'
import classes from '../styles/EditForm.module.css'

const DeleteAccountPage = (props) => {

    const password = useField('password', 'password', 'Password', '')

    const resetForm = (event) => {
        event.preventDefault()
        password.reset()
    }

    const deleteUser = (id) => {
        const passwordToSend = { password: password.attributes.value }
        if(confirm('Are you sure you want to delete your account? This action is permanent'))
        
        props.deleteUser(id, passwordToSend)
    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
                <h2>Delete your account</h2>
                <p><em>If you delete your account, you are unable to restore your data</em></p>
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
    }
  }

const mapDispatchToProps = {
    deleteUser
 }


const ConnectedDeleteAccountPage= connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteAccountPage)

export default ConnectedDeleteAccountPage