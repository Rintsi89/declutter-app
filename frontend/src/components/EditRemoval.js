import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Item, Icon, Form, Header, Button } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import { withRouter } from "react-router"
import { updateImage, deleteImage, deleteRemoval, updateRemoval } from '../reducers/removalReducer'
import { showMessage } from '../reducers/notificationReducer'
import { useField } from '../hooks'
import Title from './Title'
import PictureForm from './PictureForm'
import EditRemovalForm from './EditRemovalForm'
import classes from '../styles/RemovalPage.module.css'

const EditRemoval = (props) => {

    if (!props.removal) {
        return null
    }
    
    // Today's date for date field's default value
    const today = new Date().toISOString().substr(0, 10)

    // Data for chart 

    // Days used to remove this item
    const daysUsed = ((Date.parse(props.removal.dateRemoved) - Date.parse(props.removal.date)) / (1000*60*60*24) + 1)
    console.log(daysUsed);
    
    // Days used to remove all items which have the same status as the removal (sold and donated items are treated differently)
    const daysUsedAllItems = props.removals.filter((r) => r.saleItem === props.removal.saleItem && (Date.parse(r.dateRemoved) - Date.parse(r.date))).map((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date) ) / (1000*60*60*24))
    console.log(daysUsedAllItems);
    const daysUsedAllItemsAverage = Math.round(daysUsedAllItems.reduce((total, day) => total + day, 0) / daysUsedAllItems.length)
    console.log(daysUsedAllItemsAverage)

    // Days used to remove all items which have same category (sold or donated) and status as the sale item
    const sameCategoryItems = props.removals.filter((r) =>  r.saleItem === props.removal.saleItem && r.category === props.removal.category)
    const daysUsedAllCategory = sameCategoryItems.filter((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date))).map((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date) ) / (1000*60*60*24))
    const daysUsedAllCategoryAverage = Math.round(daysUsedAllCategory.reduce((total, day) => total + day, 0) / daysUsedAllCategory.length)
    console.log(daysUsedAllCategoryAverage);



const labels = ['All items average', props.removal.category + ' average', props.removal.name]
const barData = [daysUsedAllItemsAverage, daysUsedAllCategoryAverage, daysUsed]
const allAverages = [].concat(daysUsedAllCategoryAverage, daysUsedAllItemsAverage, daysUsed)
console.log(...allAverages);


const data = {
    labels: labels,
    datasets: [{
        data: barData,
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        ]
    }]
}

const options = {
    legend: {
        display: false
    },
    title: {
        display: true,
        text: props.removal.saleItem ? 'Days used to sell' : 'Days used to donate'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
          max: Math.ceil((Math.max(...allAverages) + 1) / 10) * 10
        }    
      }]
    }
  }

    const [form, setForm] = useState(null)
    const [showmModal, setShowModal] = useState(false)
    const dateRemoved = useField('date', 'dateRemoved', 'Date removed', today)
    const value = useField('number', 'value', 'Value', props.removal.value)

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

    const markUnSold = (event, removal) => {
        event.preventDefault()

        const updateObject = {
            ...removal,
            removed: false,
            dateRemoved: null
        }

        props.updateRemoval(removal.id, updateObject)
    }
    
    const hideModal = async (event) => {
        event.preventDefault()
        setShowModal(false)
    }

    const updateImage = (id, image, callback) => {

        if (!image) {
            return alert('Select image first!')
        }

        let formData = new FormData()
        formData.append('image', image)
        props.updateImage(id, formData)
        callback()
    }
    

    const deleteImage = (event, id) => {
        event.preventDefault()

        if (!props.removal.image) {
            return alert('There is no image to delete')
        } else { 
            confirm('Are you sure you want to delete this picture') 
            props.deleteImage(id)
        }
    }

    const deleteRemoval = async (event, id, name) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${name}`))
     
        try {
            await props.deleteRemoval(id, name)
            props.history.push('/')
        } catch (error) {
            // here props.message
        } 
    }

    return(
        <div>
            <div>
                <Title title={props.removal.name} />
            </div>
            <div className={classes.infoarea}>
                <Modal as={Form} onSubmit={(event) => markSold(event, props.removal)} open={showmModal} size="tiny">
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
                <Item.Group>
                    <Item>
                    <Item.Image size='small' src={props.removal.image} />
                    <Item.Content className={classes.content}>
                        <Item.Header as='a'>{props.removal.name}</Item.Header>
                        <Item.Meta>{props.removal.note}</Item.Meta>
                        <Item.Description>Name: {props.removal.name}</Item.Description>
                        <Item.Description>Locations: {props.removal.name}</Item.Description>
                        <Item.Extra>You have currently {props.removal.name} removals</Item.Extra>
                        
                    </Item.Content>
                    <Item.Content className={classes.bar}>
                    <Bar data={data} options={options}/>
                    </Item.Content>
                    <Item.Content>
                        <Item.Header as='a'>Actions</Item.Header>
                        <Item.Meta>What you would like to do with your account?</Item.Meta>
                        {props.removal.removed ? 
                        <div>
                            <Item.Description><Icon name='delete' /><button onClick={(event) => markUnSold(event, props.removal)}>Mark not removed</button></Item.Description>
                        </div> :
                        <Item.Description><Icon name='money bill alternate outline' /><button onClick={() => setShowModal(true)}>Mark removed</button></Item.Description> 
                        }
                        <Item.Description><Icon name='edit' /><button onClick={() => setForm('editform')}>Edit removal details</button></Item.Description>
                            <Item.Description><Icon name='image outline' /><button onClick={() => setForm('imageform')}>Edit removal image</button></Item.Description>
                            <Item.Description><Icon name='trash alternate outline' /><button onClick={(event) => deleteRemoval(event, props.removal.id, props.removal.name)}>Delete removal</button></Item.Description>
                    </Item.Content>
                    </Item>
                </Item.Group>
            </div>
            {!form ? null : form === 'editform' ? <EditRemovalForm user={props.logged_user} removal={props.removal} setBack={setForm}/> :
             form === 'imageform' ?
             <PictureForm label={'Select new picture'} title={'Edit removal picture'} id={props.removal.id} delete={deleteImage} update={updateImage}/> :
             null }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
      removals: state.removals
    }
  }

const mapDispatchToProps = {
    updateRemoval,
    updateImage,
    deleteImage,
    deleteRemoval,
    showMessage
}

const ConnectedEditRemoval = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditRemoval)


export default withRouter(ConnectedEditRemoval)