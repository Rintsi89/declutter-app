import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon } from 'semantic-ui-react'
import { useField } from '../hooks'
import { addLocation, deleteLocation } from '../reducers/userReducer'
import classes from '../styles/EditForm.module.css'
import classes2 from '../styles/Table.module.css'

const LocationForm = (props) => {

    const location = useField('text', 'location', 'Type new location', '')

    const resetForm = (event) => {
        event.preventDefault()
        location.reset()
    }

    const addLocation = async (id) => {
        event.preventDefault()

        if (!location.attributes.value) {
            return alert('You must type location name!')
        }

        const newLocation = {
            location: location.attributes.value
        }

        try {
            await props.addLocation(id, newLocation)
            location.reset()
        } catch (error) {
            // here props.message
        }
        
    }

    const deleteLocation = async (event, id, location) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${location}`))
     
        try {
            await props.deleteLocation(id, { location })
        } catch (error) {
            // here props.message
        }
        
    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
            <h2>Edit your locations</h2>
            <p>Your current locations are:</p>
            <ul>
                {props.logged_user.locations.map(l => 
                <li key={l}>
                    {l} 
                    <button className={classes2.button} onClick={() => deleteLocation(event, props.logged_user.id, l)}>
                    <Icon name="trash alternate outline"></Icon></button>
                </li>)}
            </ul>
            <Form onSubmit={() => addLocation(props.logged_user.id)}>
                <Form.Group>
                    <Form.Field width={5}>
                    <label>Add new location</label>
                    <input {...location.attributes}></input>
                    </Form.Field>
                </Form.Group>
                <Button.Group>
                    <Button onClick={(event) => resetForm(event)}>Cancel</Button>
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
    addLocation,
    deleteLocation
}

const ConnectedLocationForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(LocationForm )

export default ConnectedLocationForm