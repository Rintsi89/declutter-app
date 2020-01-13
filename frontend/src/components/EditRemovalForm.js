import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { updateRemoval } from '../reducers/removalReducer'
import { useField } from '../hooks'
import classes from '../styles/EditForm.module.css'

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
    const heigth = useField('number', 'height', 'Heigth', props.removal.heigth)
    const weigth = useField('number','weigth', 'Weigth', props.removal.weigth)
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
    const resetForm = () => {
        name.initialize()
        quantity.initialize()
        length.initialize()
        width.initialize()
        heigth.initialize()
        weigth.initialize()
        value.initialize()
        note.initialize()
        date.initialize()
        setLocation(props.removal.location)
        setCategory(props.removal.category)
        setSaleLocation(props.removal.soldAt)
        setType(props.removal.saleItem)
    }
    
    const updateRemoval = async (id) => {

        try {

            const updateObject = {
                saleItem: type,
                name: name.attributes.value,
                quantity: quantity.attributes.value,
                category: category,
                weigth: weigth.attributes.value,
                totalWeigth: weigth.attributes.value * quantity.attributes.value,
                value: !type ? 0 : value.attributes.value,
                totalValue: value.attributes.value * quantity.attributes.value,
                date: date.attributes.value,
                dateRemoved: !props.removal.removed ? null : dateRemoved.attributes.value,
                location: location,
                soldAt: saleLocation,
                note: note.attributes.value,
                length: length.attributes.value,
                width: width.attributes.value,
                heigth: heigth.attributes.value,
                cbm: (((length.attributes.value * width.attributes.value * heigth.attributes.value) * quantity.attributes.value) / 1000000).toFixed(2),
            }

            props.updateRemoval(id, updateObject)
        
        } catch (exception) {
        //   title.reset()
        //   author.reset()
        //   url.reset()
        //   props.showMessage('Error', 'No blog was added, something went wrong', 'error', 5000)
        }
      }

    return (
      <div>
        <div className={classes.container}>
        <div className={classes.formarea}>
        <h3>Edit removal</h3>
        <p>Fill in the details <em><b>per unit</b></em></p>
        <Form onSubmit={() => updateRemoval(props.removal.id)}>
            <Form.Group widths='equal'>
            <Form.Select fluid label='Type' value={type} options={types} onChange={handleTypeChange} required />
                <Form.Field>
                    <label>Name</label>
                    <input {...name.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Quantity</label>
                    <input {...quantity.attributes}></input>
                </Form.Field>
                <Form.Select fluid label='Category' value={category} options={props.user.categories} onChange={handleCategoryChange}/>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Length (cm)</label>
                    <input {...length.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Width (cm)</label>
                    <input {...width.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Height (cm)</label>
                    <input {...heigth.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Weigth (kg)</label>
                    <input {...weigth.attributes}></input>
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Value (€)</label>
                    {!type ? <input {...value.attributes} disabled /> : <input {...value.attributes} /> }
                </Form.Field>
                    <Form.Select fluid label='Location' value={location} options={createLocations(props.user.locations)} onChange={handleLocationChange}/>
                    <Form.Field>
                    <Form.Select fluid label='Sold at' value={saleLocation} options={props.user.saleLocations} onChange={handleSaleLocationChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Notes</label>
                    <input {...note.attributes}></input>
                </Form.Field> 
            </Form.Group>
            <Form.Group>
                <Form.Field>
                    <label>Date created</label>
                    <input {...date.attributes} max={today}></input>
                </Form.Field>
                <Form.Field>
                    <label>Date removed</label>
                    {!props.removal.removed ? <input {...dateRemoved.attributes} disabled /> : <input {...dateRemoved.attributes} required min={date.attributes.value} max={today} /> }
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
      </div>
    )
  }

const mapDispatchToProps = {
    updateRemoval
}

const ConnectedEditRemovalForm = connect(
    null,
    mapDispatchToProps
)(EditRemovalForm)


export default ConnectedEditRemovalForm