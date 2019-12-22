import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { createRemoval } from '../reducers/removalReducer'
import { useField } from '../hooks'

const RemovalForm = (props) => {    

    // Input
    const name = useField('text', 'name', 'Name')
    const quantity = useField('number', 'quantity', 'Quantity')
    const length = useField('number', 'length', 'Length')
    const width = useField('number', 'width', 'Width')
    const height = useField('number', 'height', 'Heigth')
    const weigth = useField('number','weigth', 'Weigth')
    const value = useField('number', 'value', 'Value')
    const note = useField('text', 'note', 'Notes')
    const image = useField('file', 'image', 'Image')
    const date = useField('date', 'date', 'Date')

    // Select
    const [location, setLocation] = useState(null)
    const [category, setCategory] = useState(null)

    // Select options of category
    const categories = [
        { key: 'c', text: 'Clothes', value: 'Clothes'},
        { key: 's', text: 'Sentimental items', value: 'Sentimental items' },
        { key: 'se', text: 'Sport equipment', value: 'Sport equipment' },
        { key: 'f', text: 'Furniture', value: 'Furniture'},
        { key: 'e', text: 'Electric appliances', value: 'Electric appliances' },
        { key: 'd', text: 'Dishes', value: 'Dishes'},
        { key: 'b', text: 'Books', value: 'Books'},
        { key: 'do', text: 'Documents', value: 'Documents'}
    ]

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
    
    const addRemoval = async (event) => {
        event.preventDefault()
    
        try {
          const removalObject = {
              name: name.attributes.value,
              quantity: quantity.attributes.value,
              category,
              weigth: weigth.attributes.value,
              value: value.attributes.value,
              date: date.attributes.value,
              location,
              note: note.attributes.value,
              image: image.attributes.value,
              cbm: ((length.attributes.value * width.attributes.value * height.attributes.value) / 1000000).toFixed(2)
          }
          
          props.createRemoval(removalObject)
    
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
        <Form onSubmit={addRemoval}>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Name</label>
                    <input {...name.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Quantity</label>
                    <input {...quantity.attributes}></input>
                </Form.Field>
                <Form.Select fluid label='Category' value={category} options={categories} onChange={handleCategoryChange}/>
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
                    <input {...image.attributes}></input>
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