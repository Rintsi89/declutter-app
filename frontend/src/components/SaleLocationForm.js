import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon } from 'semantic-ui-react'
import { useField } from '../hooks'
import { addSaleLocation, deleteSaleLocation } from '../reducers/userReducer'
import classes from '../styles/EditForm.module.css'
import classes2 from '../styles/Table.module.css'

const SaleLocationForm = (props) => {

    const saleLocation = useField('text', 'saleLocation', 'Type new sale location', '')

    const resetForm = (event) => {
        event.preventDefault()
        saleLocation.reset()
    }

    const addSaleLocation = async (id) => {
        event.preventDefault()

        if (!saleLocation.attributes.value) {
            return alert('You must type sale location name!')
        }

        const newSaleLocation = {
            key: saleLocation.attributes.value,
            text: saleLocation.attributes.value,
            value: saleLocation.attributes.value
        }
        
        try {
            await props.addSaleLocation(id, newSaleLocation)
            saleLocation.reset()
        } catch (error) {
            // here props.message
        }
        
    }

    const deleteSaleLocation = async (event, id, saleLocation) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${saleLocation}`))
     
        try {
            await props.deleteSaleLocation(id, { saleLocation })
        } catch (error) {
            // here props.message
        }
        
    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
            <h2>Edit your sale locations</h2>
            <p>Your current sale locations are:</p>
            {props.logged_user.saleLocations.length < 1 ? 
                <p>
                    You don't have any sale locations.
                </p> :
            <ul>
                {props.logged_user.saleLocations.map(l => 
                <li key={l.value}>
                    {l.value} 
                    <button className={classes2.button} onClick={() => deleteSaleLocation(event, props.logged_user.id, l.value)}>
                    <Icon name="trash alternate outline"></Icon></button>
                </li>)}
            </ul>
            }
            <Form onSubmit={() => addSaleLocation(props.logged_user.id)}>
                <Form.Group>
                    <Form.Field width={5}>
                    <label>Add new sale location</label>
                    <input {...saleLocation.attributes}></input>
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
    addSaleLocation,
    deleteSaleLocation
}

const ConnectedSaleLocationForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(SaleLocationForm)

export default ConnectedSaleLocationForm