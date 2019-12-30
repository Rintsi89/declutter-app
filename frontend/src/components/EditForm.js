import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, TextArea } from 'semantic-ui-react'
import { useField } from '../hooks'
import { updateUser } from '../reducers/userReducer'
import classes from '../styles/EditForm.module.css'

const EditForm = (props) => {

    const username = useField('text', 'username', null, props.logged_user.username)
    const name = useField('text', 'name', null, props.logged_user.name)
    const description = useField(null, 'description', null, props.logged_user.description)
    
    const resetForm = () => {
        username.initialize()
        name.initialize()
        description.initialize()
    }
    
    const updateUser = (id) => {
        const updateArguments = {
            username: username.attributes.value,
            name: name.attributes.value,
            description: description.attributes.value
        }
        props.updateUser(id, updateArguments)
    }
    
    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
            <h2>Edit your details</h2>
            <Form onSubmit={() => updateUser(props.logged_user.id)}>
                <Form.Group>
                    <Form.Field width={3}>
                        <label>Username</label>
                        <input {...username.attributes}></input>
                    </Form.Field>
                    <Form.Field width={3}>
                        <label>Name</label>
                        <input {...name.attributes}></input>
                    </Form.Field>
                    <Form.Field width={10}>
                        <label>Description</label>
                        <TextArea {...description.attributes}>
                        </TextArea>
                    </Form.Field>
                </Form.Group>
                <Button.Group>
                    <Button onClick={resetForm}>Cancel</Button>
                    <Button.Or />
                    <Button positive>Save</Button>
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

const mapDispatchToProps = {
    updateUser
}

const ConnectedEditForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(EditForm)

export default ConnectedEditForm