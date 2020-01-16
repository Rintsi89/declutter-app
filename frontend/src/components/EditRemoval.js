import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Item, Icon } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import { withRouter } from "react-router"
import SaleModal from './SaleModal'
import { updateImage, deleteImage, deleteRemoval, updateRemoval } from '../reducers/removalReducer'
import { showMessage } from '../reducers/notificationReducer'
import { initModal } from '../reducers/removalModalReducer'
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
    console.log((Date.parse(props.removal.dateRemoved) - Date.parse(props.removal.date)) / (1000*60*60*24) +1);
    
    console.log(daysUsed);
    
    // Days used to remove all items which have the same status as the removal (sold and donated items are treated differently)
    const daysUsedAllItems = props.removals.filter((r) => r.saleItem === props.removal.saleItem && (Date.parse(r.dateRemoved) - Date.parse(r.date))).map((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date)) / (1000*60*60*24) + 1)
    console.log("All items", daysUsedAllItems);
    const daysUsedAllItemsAverage = Math.round(daysUsedAllItems.reduce((total, day) => total + day, 0) / daysUsedAllItems.length)
    console.log(daysUsedAllItemsAverage)

    // Days used to remove all items which have same category (sold or donated) and status as the sale item
    const sameCategoryItems = props.removals.filter((r) =>  r.saleItem === props.removal.saleItem && r.category === props.removal.category)
    console.log(sameCategoryItems);
    
    const daysUsedAllCategory = sameCategoryItems.filter((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date) >= 0)).map((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date) ) / (1000*60*60*24) + 1)
    console.log(daysUsedAllCategory);
    
    const daysUsedAllCategoryAverage = Math.round(daysUsedAllCategory.reduce((total, day) => total + day, 0) / daysUsedAllCategory.length)
    console.log(daysUsedAllCategoryAverage);

    const labels = ['All items average', props.removal.category + ' average', props.removal.name]
    const barData = [daysUsedAllItemsAverage, daysUsedAllCategoryAverage, daysUsed]
    const allAverages = [].concat(daysUsedAllCategoryAverage, daysUsedAllItemsAverage, daysUsed)
    


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

    const markUnSold = (event, removal) => {
        event.preventDefault()

        const updateObject = {
            ...removal,
            removed: false,
            dateRemoved: null
        }

        props.updateRemoval(removal.id, updateObject)
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
                <SaleModal />
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
                    <Item.Content >
                    {props.removal.removed ?
                    <Bar data={data} options={options}/> :
                    <p>This item is not yet removed</p>
                    }
                    </Item.Content>
                    <Item.Content>
                        <Item.Header as='a'>Actions</Item.Header>
                        <Item.Meta>What you would like to do with removal?</Item.Meta>
                        {props.removal.removed ? 
                        <div>
                            <Item.Description><Icon name='delete' /><button onClick={(event) => markUnSold(event, props.removal)}>Mark not removed</button></Item.Description>
                        </div> :
                        <Item.Description><Icon name='money bill alternate outline' /><button onClick={() => props.initModal(props.removal)}>Mark removed</button></Item.Description> 
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
    showMessage,
    initModal
}

const ConnectedEditRemoval = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditRemoval)


export default withRouter(ConnectedEditRemoval)