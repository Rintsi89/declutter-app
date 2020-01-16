import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Header, Button } from 'semantic-ui-react'
import { hideModal } from '../reducers/removalModalReducer'
import { updateRemoval } from '../reducers/removalReducer'
import { useField } from '../hooks'

const SaleModal = (props) => {

    if (!props.modal.visible) {
        return null
    }

    // Today's date for date field's default value
    const today = new Date().toISOString().substr(0, 10)

    const dateRemoved = useField('date', 'dateRemoved', 'Date removed', today)
    const value = useField('number', 'value', 'Value', props.modal.removal.value)

    const markSold = async (event, removal) => {

        event.preventDefault()

        try {

            const updateObject = {
                ...removal,
                removed: true,
                dateRemoved: dateRemoved.attributes.value,
                value: value.attributes.value,
                totalValue: value.attributes.value * removal.quantity
            }

            await props.updateRemoval(removal.id, updateObject)
            props.hideModal()
            window.scrollTo(0, document.body.scrollHeight)
            
        } catch (error) {
            
        }
    }

    return (
        <Modal as={Form} onSubmit={(event) => markSold(event, props.modal.removal)} open={props.modal.visible} size="tiny">
            <Header content="When this item was removed?" as="h2" />
            <Modal.Content>
                <label>Date removed</label>
                <input {...dateRemoved.attributes} required max={today} min={props.modal.removal.date}/>
                {props.modal.removal.saleItem ?
                <div>
                    <label>Unit value (€)</label>
                    <input {...value.attributes} />
                </div>
                : null 
                }
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => props.hideModal()} color="#e0e1e2" content="Cancel" />
                <Button type="submit" color="blue" content="Save" />
            </Modal.Actions>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    return {
        modal: state.modal
    }
  }

const mapDispatchToProps = {
    hideModal,
    updateRemoval
}

const ConnectedSaleModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(SaleModal)


export default ConnectedSaleModal
