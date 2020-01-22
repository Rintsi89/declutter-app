import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon } from 'semantic-ui-react'
import { useField } from '../../../hooks'
import { addLocation, deleteLocation } from '../../../reducers/userReducer'
import { showMessage } from '../../../reducers/notificationReducer'
import classes from './EditLocationForm.module.css'

const LocationForm = (props) => {

  const location = useField('text', 'location', 'Type new location', '')

  const resetForm = (event) => {
    event.preventDefault()

    location.reset()
    props.setBack(null)
    window.scrollTo(0, 0)
  }

  const addLocation = async (id) => {

    if (!location.attributes.value) {
      return alert('You must type location name!')
    }

    try {

      const newLocation = {
        location: location.attributes.value
      }

      props.setBack(null)
      window.scrollTo(0, 0)
      await props.addLocation(id, newLocation)
    } catch (error) {
      window.scrollTo(0, 0)
      props.showMessage('Error', error.response.data.error, 'negative')
    }

  }

  const deleteLocation = async (event, id, location) => {
    event.preventDefault()

    if (confirm(`Are you sure you want to delete ${location}`))

      try {
        props.setBack(null)
        window.scrollTo(0, 0)
        await props.deleteLocation(id, { location })
      } catch (error) {
        window.scrollTo(0, 0)
        props.showMessage('Error', error.response.data.error, 'negative')
      }

  }

  return (
    <div className={classes.container}>
      <div className={classes.formarea}>
        <h3 className={classes.title}>Edit your locations</h3>
        <p><em><b>Your current locations are:</b></em></p>
        <ul className={classes.locations}>
          {props.logged_user.locations.sort().map(l =>
            <li key={l}>
              {l}
              <button className={classes.button} onClick={() => deleteLocation(event, props.logged_user.id, l)}>
                <Icon name="trash alternate outline" /></button>
            </li>)}
        </ul>
        <Form onSubmit={() => addLocation(props.logged_user.id)}>
          <Form.Group>
            <Form.Field width={5}>
              <label>Add new location</label>
              <input {...location.attributes} required />
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
  addLocation,
  deleteLocation,
  showMessage
}

const ConnectedLocationForm= connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationForm )

export default ConnectedLocationForm