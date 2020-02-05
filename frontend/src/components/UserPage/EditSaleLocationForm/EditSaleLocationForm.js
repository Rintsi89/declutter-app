import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon } from 'semantic-ui-react'
import { useField } from '../../../hooks'
import { addSaleLocation, deleteSaleLocation } from '../../../reducers/userReducer'
import { showMessage } from '../../../reducers/notificationReducer'
import classes from './EditSaleLocationForm.module.css'

const SaleLocationForm = (props) => {

  const saleLocation = useField('text', 'saleLocation', 'Type new sale location', '')

  const resetForm = (event) => {
    event.preventDefault()

    saleLocation.reset()
    props.setBack(null)
    window.scrollTo(0, 0)
  }

  const addSaleLocation = async (id) => {
    event.preventDefault()

    if (!saleLocation.attributes.value) {
      window.scrollTo(0,0)
      return props.showMessage('Error', 'Sale location can\'t be blank','negative')
    }

    try {

      const newSaleLocation = {
        key: saleLocation.attributes.value,
        text: saleLocation.attributes.value,
        value: saleLocation.attributes.value
      }

      props.setBack(null)
      window.scrollTo(0, 0)
      await props.addSaleLocation(id, newSaleLocation)
    } catch (error) {
      window.scrollTo(0, 0)
      props.showMessage('Error', error.response.data.error, 'negative')
    }

  }

  const deleteSaleLocation = async (event, id, saleLocation) => {
    event.preventDefault()

    if (confirm(`Are you sure you want to delete ${saleLocation}`))

      try {
        props.setBack(null)
        window.scrollTo(0, 0)
        await props.deleteSaleLocation(id, { saleLocation })
      } catch (error) {
        window.scrollTo(0, 0)
        props.showMessage('Error', error.response.data.error, 'negative')
      }

  }

  return (
    <div className={classes.container}>
      <div className={classes.formarea}>
        <h3 className={classes.title}>Edit your sale locations</h3>
        <p><em><b>Your current sale locations are:</b></em></p>
        {props.logged_user.saleLocations.length < 1 ?
          <p>You do not have any sale locations.</p> :
          <ul className={classes.salelocations} data-cy='salelocationlist'>
            {props.logged_user.saleLocations.map(l => l.value).sort().map(l =>
              <li key={l}>
                {l}
                <button className={classes.button} onClick={() => deleteSaleLocation(event, props.logged_user.id, l)} data-cy='delete'>
                  <Icon name="trash alternate outline" />
                </button>
              </li>)}
          </ul>
        }
        <Form onSubmit={() => addSaleLocation(props.logged_user.id)}>
          <Form.Group>
            <Form.Field width={5}>
              <label>Add new sale location</label>
              <input {...saleLocation.attributes} data-cy='salelocation' />
            </Form.Field>
          </Form.Group>
          <Button.Group>
            <Button onClick={(event) => resetForm(event)}>Cancel</Button>
            <Button.Or />
            <Button primary data-cy='save'>Save</Button>
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
  addSaleLocation,
  deleteSaleLocation,
  showMessage
}

const ConnectedSaleLocationForm= connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleLocationForm)

export default ConnectedSaleLocationForm