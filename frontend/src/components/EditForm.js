import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, TextArea } from 'semantic-ui-react'
import { useField } from '../hooks'
import { updateUser } from '../reducers/userReducer'
import { showMessage } from '../reducers/notificationReducer'
import classes from '../styles/EditForm.module.css'

const EditForm = (props) => {

    const username = useField('text', 'username', null, props.logged_user.username)
    const name = useField('text', 'name', null, props.logged_user.name)
    const email = useField('email', 'email', null, props.logged_user.email)
    const description = useField(null, 'description', null, props.logged_user.description)
    
    const resetForm = (event) => {

        event.preventDefault()

        username.initialize()
        name.initialize()
        email.initialize()
        description.initialize()
        props.setBack(null)
        window.scrollTo(0, 0)
    }
    
    const updateUser = async (id) => {

        try {

            const updateArguments = {
                username: username.attributes.value,
                name: name.attributes.value,
                email: email.attributes.value,
                description: description.attributes.value
            }
            props.setBack(null)
            window.scrollTo(0, 0)
            await props.updateUser(id, updateArguments)
            
        } catch (error) {
            window.scrollTo(0, 0)
            props.showMessage('Error', error.response.data.error, 'negative')
        }

    }
    
    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
                <h3 className={classes.title}>Edit your details</h3>
                    <Form onSubmit={() => updateUser(props.logged_user.id)}>
                        <Form.Group>
                            <Form.Field width={4}>
                                <label>Username</label>
                                <input {...username.attributes} required/>
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>Name</label>
                                <input {...name.attributes} required/>
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>Email</label>
                                <input {...email.attributes} required/>
                            </Form.Field>
                            <Form.Field width={5}>
                                <label>Description</label>
                                <TextArea {...description.attributes}>
                                </TextArea>
                            </Form.Field>
                        </Form.Group>
                        <Button.Group>
                            <Button onClick={(event) => resetForm(event)}>Cancel</Button>
                            <Button.Or />
                            <Button primary>Save</Button>
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
    updateUser,
    showMessage
}

const ConnectedEditForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(EditForm)

export default ConnectedEditForm