import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { createRemoval } from '../reducers/removalReducer'
import { useField } from '../hooks'

const RemovalForm = (props) => {    

    // Input
    const name = useField('text', 'name', 'Name', '')
    const quantity = useField('number', 'quantity', 'Quantity', '')
    const length = useField('number', 'length', 'Length', '')
    const width = useField('number', 'width', 'Width', '')
    const height = useField('number', 'height', 'Heigth', '')
    const weigth = useField('number','weigth', 'Weigth', '')
    const value = useField('number', 'value', 'Value', '')
    const note = useField('text', 'note', 'Notes', '')
    const date = useField('date', 'date', 'Date', '')
    
    // Select
    const [location, setLocation] = useState(null)
    const [category, setCategory] = useState(null)

    // Image

    const [image, setImage] = useState(null)

    // Select options of location
    const createLocations = (locations) => {
        const locationsArray = []
        locations.forEach(l => {
            const locationToMap = { 'key': l, 'text': l, 'value': l } 
            locationsArray.push(locationToMap)
        }) 
        return locationsArray
        }

    const handleCategoryChange = (event, data) => {
        setCategory(data.value)
    }

     const handleLocationChange = (event, data) => {
        setLocation(data.value)  
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
        weigth.reset()
        value.reset()
        note.reset()
        date.reset()
        setCategory(null)
        setLocation(null)
        setImage(null)
    }
    
    const addRemoval = async (event) => {
        event.preventDefault()
    
        try {

            let formData = new FormData()
            formData.set('name', name.attributes.value)
            formData.set('quantity', quantity.attributes.value)
            formData.set('category', category)
            formData.set('weigth', weigth.attributes.value)
            formData.set('value', value.attributes.value)
            formData.set('date', date.attributes.value)
            formData.set('location', location)
            formData.set('note', note.attributes.value)
            formData.set('cbm', ((length.attributes.value * width.attributes.value * height.attributes.value) / 1000000).toFixed(2))
            formData.append('image', image)
            
            props.createRemoval(formData)
            resetForm()
    
        } catch (exception) {
        //   title.reset()
        //   author.reset()
        //   url.reset()
        //   props.showMessage('Error', 'No blog was added, something went wrong', 'error', 5000)
        }
      }

    return (
      <div>
        <h3>Create a new removal</h3>
        <p>Fill in the details <em><b>per unit</b></em></p>
        <Form onSubmit={addRemoval} encType="multipart/form-data">
            <Form.Group widths='equal'>
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
                    <input {...height.attributes}></input>
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Weigth (kg)</label>
                    <input {...weigth.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Value (€)</label>
                    <input {...value.attributes}></input>
                </Form.Field>
                    <Form.Select fluid label='Location' value={location} options={createLocations(props.user.locations)} onChange={handleLocationChange}/> 
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Notes</label>
                    <input {...note.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e.target.files[0])}></input>
                </Form.Field>
                <Form.Field>
                    <label>Date</label>
                    <input {...date.attributes}></input>
                </Form.Field>
            </Form.Group>
            <Form.Field control={Button}>Submit</Form.Field>
        </Form>
      </div>
    )
  }

const mapDispatchToProps = {
    createRemoval
}

const ConnectedRemovalForm = connect(
    null,
    mapDispatchToProps
)(RemovalForm)


export default ConnectedRemovalForm