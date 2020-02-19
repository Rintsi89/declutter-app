import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { updateRemoval } from '../../../reducers/removalReducer'
import { showMessage } from '../../../reducers/notificationReducer'
import { useField } from '../../../hooks'
import classes from './EditRemovalForm.module.css'

const EditRemovalForm = (props) => {

  // Today's date for date field's default value
  const today = new Date().toISOString().substr(0, 10)

  // Options for removal types
  const types  = [
    { key: 's', text: 'For sale', value: true },
    { key: 'd', text: 'For donation', value: false },
  ]

  // Input
  const name = useField('text', 'name', 'Name', props.removal.name)
  const quantity = useField('number', 'quantity', 'Quantity', props.removal.quantity)
  const length = useField('number', 'length', 'Length', props.removal.length)
  const width = useField('number', 'width', 'Width', props.removal.width)
  const height = useField('number', 'height', 'Height', props.removal.height)
  const weight = useField('number','weight', 'Weight', props.removal.weight)
  const value = useField('number', 'value', 'Value', props.removal.value)
  const note = useField('text', 'note', 'Notes', props.removal.note)
  const date = useField('date', 'date', 'Date', props.removal.date)
  const dateRemoved = useField('date', 'dateRemoved', 'Date removed', props.removal.dateRemoved)

  // Select
  const [type, setType] = useState(props.removal.saleItem)
  const [location, setLocation] = useState(props.removal.location)
  const [category, setCategory] = useState(props.removal.category)
  const [saleLocation, setSaleLocation] = useState(props.removal.soldAt)

  // Select options of location
  const createLocations = (locations) => {
    const locationsArray = []
    locations.forEach(l => {
      const locationToMap = { 'key': l, 'text': l, 'value': l }
      locationsArray.push(locationToMap)
    })
    return locationsArray
  }

  const handleTypeChange = (event, data) => {
    setType(data.value)
  }

  const handleCategoryChange = (event, data) => {
    setCategory(data.value)
  }

  const handleLocationChange = (event, data) => {
    setLocation(data.value)
  }

  const handleSaleLocationChange = (event, data) => {
    setSaleLocation(data.value)
  }

  // Reset form to initial state
  const resetForm = (event) => {

    event.preventDefault()

    name.initialize()
    quantity.initialize()
    length.initialize()
    width.initialize()
    height.initialize()
    weight.initialize()
    value.initialize()
    note.initialize()
    date.initialize()
    setLocation(props.removal.location)
    setCategory(props.removal.category)
    setSaleLocation(props.removal.soldAt)
    setType(props.removal.saleItem)

    props.setBack(null)
  }

  const updateRemoval = async (id) => {

    if (!name.attributes.value) {
      window.scrollTo(0,0)
      return props.showMessage('Error', 'Name can\'t be blank', 'negative')
    }

    if (!quantity.attributes.value) {
      window.scrollTo(0,0)
      return props.showMessage('Error', 'Quantity can\'t be blank', 'negative')
    }

    if (!value.attributes.value && type) {
      window.scrollTo(0,0)
      return props.showMessage('Error', 'Value can\'t be blank', 'negative')
    }

    try {

      const updateObject = {
        saleItem: type,
        name: name.attributes.value,
        quantity: quantity.attributes.value,
        category: category,
        weight: !weight.attributes.value ? 0 : weight.attributes.value,
        totalWeight: weight.attributes.value * quantity.attributes.value,
        value: !type ? 0 : value.attributes.value,
        totalValue: value.attributes.value * quantity.attributes.value,
        date: date.attributes.value,
        dateRemoved: !props.removal.removed ? null : dateRemoved.attributes.value,
        location: location,
        soldAt: saleLocation,
        note: note.attributes.value,
        length: !length.attributes.value ? 0 : length.attributes.value ,
        width: !width.attributes.value ? 0 : width.attributes.value,
        height: !height.attributes.value ? 0 : height.attributes.value,
        cbm: (((length.attributes.value * width.attributes.value * height.attributes.value) * quantity.attributes.value) / 1000000).toFixed(2)
      }

      props.setBack(null)
      await props.updateRemoval(id, updateObject)


    } catch (error) {
      props.setBack(null)
      props.showMessage('Error', error.response.data.error, 'negative')
    }
  }

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.formarea}>
          <h3 className={classes.title}>Edit removal</h3>
          <p>Fill in the details <em><b>per unit</b></em></p>
          <Form onSubmit={() => updateRemoval(props.removal.id)}>
            <Form.Group widths='equal'>
              <Form.Select fluid label='Type' value={type} options={types} onChange={handleTypeChange} required data-cy='type' />
              <Form.Field>
                <label>Name</label>
                <input {...name.attributes} data-cy='name' />
              </Form.Field>
              <Form.Field>
                <label>Quantity</label>
                <input {...quantity.attributes} data-cy='quantity' />
              </Form.Field>
              <Form.Select fluid label='Category' value={category} options={props.user.categories} onChange={handleCategoryChange} data-cy='category' />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Length (cm)</label>
                <input {...length.attributes} data-cy='length' />
              </Form.Field>
              <Form.Field>
                <label>Width (cm)</label>
                <input {...width.attributes} data-cy='width' />
              </Form.Field>
              <Form.Field>
                <label>Height (cm)</label>
                <input {...height.attributes} data-cy='height' />
              </Form.Field>
              <Form.Field>
                <label>Weight (kg)</label>
                <input {...weight.attributes} data-cy='weight' />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Value (€)</label>
                {!type ? <input {...value.attributes} disabled data-cy='valuedisabled'/> : <input {...value.attributes} data-cy='value' /> }
              </Form.Field>
              <Form.Select fluid label='Location' value={location} options={createLocations(props.user.locations)} onChange={handleLocationChange} data-cy='location' />
              <Form.Field>
                <Form.Select fluid label='Sold at' value={saleLocation} options={props.user.saleLocations} onChange={handleSaleLocationChange} data-cy='sold' />
              </Form.Field>
              <Form.Field>
                <label>Notes</label>
                <input {...note.attributes} data-cy='note' />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>
                <label>Date created</label>
                <input {...date.attributes} max={today} data-cy='date' />
              </Form.Field>
              <Form.Field>
                <label>Date removed</label>
                {!props.removal.removed ? <input {...dateRemoved.attributes} disabled /> : <input {...dateRemoved.attributes} required min={date.attributes.value} max={today} data-cy='dateremoved'/> }
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
    </div>
  )
}

const mapDispatchToProps = {
  updateRemoval,
  showMessage
}

const ConnectedEditRemovalForm = connect(
  null,
  mapDispatchToProps
)(EditRemovalForm)


export default ConnectedEditRemovalForm