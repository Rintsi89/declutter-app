import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Select } from 'semantic-ui-react'
import { useField } from '../hooks'

const RemovalForm = ({ user }) => {    

    const name = useField('text', 'name', 'Name')
    const quantity = useField('number', 'quantity', 'Quantity')
    const category = useField(null, 'category', 'Category')
    const length = useField('number', 'length', 'Length')
    const width = useField('number', 'width', 'Width')
    const height = useField('number', 'height', 'Heigth')
    const weigth = useField('number','weigth', 'Weigth')
    const value = useField('number', 'value', 'Value')
    const location = useField('text', 'location', 'Location')
    const notes = useField('text', 'notes', 'Notes')
    const image = useField('file', 'image', 'Image')
    const date = useField('date', 'date', 'Date')
    // Change these later
    const locationOptions = [
        { key: 'm', text: 'Male', value: 'male' },
        { key: 'f', text: 'Female', value: 'female' },
        { key: 'o', text: 'Other', value: 'other' },
      ]

    return (
      <div>
        <h3>Create a new removal</h3>
        <Form>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Name</label>
                    <input {...name.attributes}></input>
                </Form.Field>
                
                <Form.Field>
                    <label>Quantity</label>
                    <input {...quantity.attributes}></input>
                </Form.Field>

                {/* Check later!
                <Form.Field>
                    <label>Category</label>;
                    <select>{...category.attributes, options={locationOptions}}</select>options=
                </Form.Field> */}
                
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
                    <label>Weight (kg)</label>
                    <input {...weigth.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Value (€)</label>
                    <input {...value.attributes}></input>
                </Form.Field>
                <Form.Field>
                    <label>Location</label>
                    <input {...location.attributes}></input>
                </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Notes</label>
                    <input {...notes.attributes}></input>
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

const mapStateToProps = (state) => {
    return {
        logged_user: state.logged_user
    }
}

const ConnectedRemovalForm = connect(
    mapStateToProps,
    null
)(RemovalForm)

export default ConnectedRemovalForm