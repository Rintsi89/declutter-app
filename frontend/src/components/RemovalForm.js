import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { createRemoval } from '../reducers/removalReducer'
import { showMessage } from '../reducers/notificationReducer'
import { useField } from '../hooks'
import classes from '../styles/AddRemovalForm.module.css'

const RemovalForm = (props) => {    

    // Today's date for date field's default value
    const today = new Date().toISOString().substr(0, 10)

    // Options for removal types
    const types  = [
        { key: 's', text: 'For sale', value: true },
        { key: 'd', text: 'For donation', value: false },
    ]

    // Options for removed already

    const removedTypes = [
        { key: 'yes', text: 'Yes', value: true },
        { key: 'no', text: 'No', value: false },
    ]

    // Sort helper

    const compare = (a, b) => {
        if (a.text < b.text) {
          return -1
        }
        if (a.text > b.text) {
          return 1
        }
        return 0
      }

    // Select options of location - different way than the other, let it be for practise :)
    const createLocations = (locations) => {
        const locationsArray = []
        locations.forEach(l => {
            const locationToMap = { 'key': l, 'text': l, 'value': l } 
            locationsArray.push(locationToMap)
        }) 
        return locationsArray.sort(compare)
    }
    
    // Sorted options for select field
    const sortedCategories = props.user.categories.sort(compare)
    const sortedLocations = createLocations(props.user.locations)
    const sortedSaleLocations = props.user.saleLocations.sort(compare)
    
    // Input
    const name = useField('text', 'name', 'Name', '')
    const quantity = useField('number', 'quantity', 'Quantity', 0)
    const length = useField('number', 'length', 'Length', 0)
    const width = useField('number', 'width', 'Width', 0)
    const height = useField('number', 'height', 'Heigth', 0)
    const weight = useField('number','weight', 'Weight', 0)
    const value = useField('number', 'value', 'Value', 0)
    const note = useField('text', 'note', 'Notes', '')
    const date = useField('date', 'date', 'Date', today)
    const dateRemoved = useField('date', 'dateRemoved', 'Date removed', today)

    // Select
    const [type, setType] = useState(types[0].value)
    const [removed, setRemoved] = useState(removedTypes[0].value)
    const [location, setLocation] = useState(sortedLocations[0].value)
    const [category, setCategory] = useState(sortedCategories[0].value)
    const [saleLocation, setSaleLocation] = useState(sortedSaleLocations[0].value)

    // Image

    const [image, setImage] = useState(null)

    // Event handlers

    const handleTypeChange = (event, data) => {
        setType(data.value)
    }
    
    const handleRemovedChange = (event, data) => {
        setRemoved(data.value)
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

    const handleFileChange = (file) => {
        setImage(file)
    }

    const resetForm = () => {
        name.reset()
        quantity.reset()
        length.reset()
        width.reset()
        height.reset()
        weight.reset()
        value.reset()
        note.reset()
        date.reset()
        dateRemoved.reset()
        setCategory(null)
        setLocation(null)
        setImage(null)
        setType(null)
        setRemoved(null)
    }

    const resetAndHide = () => {
        resetForm()
        props.hide()
        window.scrollTo(0, document.body.scrollHeight)
    }
    
    const addRemoval = async (event) => {
        event.preventDefault()
    
        try {

            let formData = new FormData()
            formData.set('saleItem', type)
            formData.set('name', name.attributes.value)
            formData.set('removed', removed)
            formData.set('quantity', quantity.attributes.value)
            formData.set('category', category)
            formData.set('date', date.attributes.value)
            formData.set('dateRemoved', !removed ? null : dateRemoved.attributes.value)
            formData.set('location', location)
            formData.set('soldAt', saleLocation)
            formData.set('note', note.attributes.value)
            formData.set('weight', weight.attributes.value)
            formData.set('totalWeight', weight.attributes.value * quantity.attributes.value)
            formData.set('value', !removed ? 0 : value.attributes.value)
            formData.set('totalValue', (value.attributes.value *quantity.attributes.value))
            formData.set('length', length.attributes.value),
            formData.set('width', width.attributes.value),
            formData.set('height', height.attributes.value)
            formData.set('cbm', (((length.attributes.value * width.attributes.value * height.attributes.value) * quantity.attributes.value) / 1000000).toFixed(2))
            formData.append('image', image)
            
            props.createRemoval(formData)
            resetAndHide()
    
        } catch (exception) {
            window.scrollTo(0, 0)
            props.showMessage('Error', error.response.data.error, 'negative')
        }
      }

    return (
      <div className={classes.container}>
        <h3 className={classes.title}>Create a new removal</h3>
        <p>Fill in the details <em><b>per unit</b></em></p>
        <Form onSubmit={addRemoval} encType="multipart/form-data">
            <Form.Group widths='equal'>
            <Form.Select fluid label='Type' value={type} options={types} onChange={handleTypeChange} />
            <Form.Select fluid label='Removed already?' value={removed} options={removedTypes} onChange={handleRemovedChange} />
                <Form.Field>
                    <label>Name</label>
                    <input {...name.attributes} required />
                </Form.Field>
                <Form.Field>
                    <label>Quantity</label>
                    <input {...quantity.attributes} required />
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
            <Form.Select fluid label='Category' value={category} options={sortedCategories} onChange={handleCategoryChange}/>
                <Form.Field>
                    <label>Length (cm)</label>
                    <input {...length.attributes} />
                </Form.Field>
                <Form.Field>
                    <label>Width (cm)</label>
                    <input {...width.attributes} />
                </Form.Field>
                <Form.Field>
                    <label>Height (cm)</label>
                    <input {...height.attributes} />
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Weight (kg)</label>
                    <input {...weight.attributes} />
                </Form.Field>
                <Form.Field>
                    <label>Value (€)</label>
                    {!type ? <input {...value.attributes} disabled /> : <input {...value.attributes} required min='1'/> }
                </Form.Field>
                    <Form.Select fluid label='Location' value={location} options={sortedLocations} onChange={handleLocationChange}/>
                    <Form.Select fluid label='Sold at' value={saleLocation} options={sortedSaleLocations} onChange={handleSaleLocationChange} />  
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Notes</label>
                    <input {...note.attributes} />
                </Form.Field>
                <Form.Field>
                    <label>Date created</label>
                    <input {...date.attributes} required max={today} />
                </Form.Field>
                <Form.Field>
                    <label>Date removed</label>
                    {!removed ? <input {...dateRemoved.attributes} disabled /> : <input {...dateRemoved.attributes} required min={date.attributes.value} max={today} /> }
                </Form.Field>
                <Form.Field>
                    <label>Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e.target.files[0])} />
                </Form.Field>
            </Form.Group>
            <Button.Group>
                    <Button onClick={resetAndHide}>Cancel</Button>
                    <Button.Or />
                    <Button primary>Save</Button>
            </Button.Group>
        </Form>
      </div>
    )
  }

const mapDispatchToProps = {
    createRemoval,
    showMessage
}

const ConnectedRemovalForm = connect(
    null,
    mapDispatchToProps
)(RemovalForm)


export default ConnectedRemovalForm