import React, { useState } from 'react'
import { Modal, Form, Header, Button } from 'semantic-ui-react'
import { useField } from '../hooks'

const SaleModal = (props) => {


    if (!props.show) {
        return null
    }

    console.log(props);
    

    // Today's date for date field's default value
    const today = new Date().toISOString().substr(0, 10)

    const dateRemoved = useField('date', 'dateRemoved', 'Date removed', today)
    const value = useField('number', 'value', 'Value', props.removal.value)
    const [showModal, setShowModal] = useState(props.show)

    const markSold = (event, removal) => {

        event.preventDefault()

        try {

            const updateObject = {
                ...removal,
                removed: true,
                dateRemoved: dateRemoved.attributes.value,
                value: value.attributes.value,
                totalValue: value.attributes.value * removal.quantity
            }

            props.updateRemoval(removal.id, updateObject)
            setShowModal(false)
            
        } catch (error) {
            
        }
    }

    const hideModal = async (event) => {
        console.log('Jee');
        
        event.preventDefault()
        setShowModal(false)
    }

    return (
        <Modal as={Form} onSubmit={(event) => markSold(event, props.removal)} open={showModal} size="tiny">
            <Header content="When this item was removed?" as="h2" />
            <Modal.Content>
                <label>Date removed</label>
                <input {...dateRemoved.attributes} required max={today} min={props.removal.date}/>
                {props.removal.saleItem ?
                <div>
                    <label>Unit value (€)</label>
                    <input {...value.attributes} />
                </div>
                : null 
                }
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={(event) => hideModal(event)} color="red" content="Cancel" />
                <Button type="submit" color="green" content="Save" />
            </Modal.Actions>
        </Modal>
    )
}

export default SaleModal