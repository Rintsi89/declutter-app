import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Confirm } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import { withRouter } from "react-router"
import { updateRemovalImage, deleteRemovalImage, deleteRemoval, updateRemoval } from '../reducers/removalReducer'
import { showMessage } from '../reducers/notificationReducer'
import { initModal } from '../reducers/removalModalReducer'
import SaleModal from './SaleModal'
import FlashMessage from './Flash/FlashMessage'
import Title from './Title'
import PictureForm from './PictureForm'
import EditRemovalForm from './EditRemovalForm'
import classes from '../styles/RemovalPage.module.css'

const EditRemoval = (props) => {

    if (!props.removal) {
        return null
    }

    const [form, setForm] = useState(null)
    const [showNotRemoved, setShowNotRemoved] = useState(false)
    const [removalNotToRemove, setRemovalNotToRemove] = useState(null)

    const setRemoveCancel = (removal) => {
        setRemovalNotToRemove(removal)
        setShowNotRemoved(true)
    }

    // Data for chart 

    // Days used to remove this item
    const daysUsed = ((Date.parse(props.removal.dateRemoved) - Date.parse(props.removal.date)) / (1000*60*60*24) + 1)

    // Days used to remove all items which have the same status as the removal (sold and donated items are treated differently)
    const daysUsedAllItems = props.removals.filter((r) => r.saleItem === props.removal.saleItem && (Date.parse(r.dateRemoved) - Date.parse(r.date) + 1)).map((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date)) / (1000*60*60*24) + 1)
    const daysUsedAllItemsAverage = Math.round(daysUsedAllItems.reduce((total, day) => total + day, 0) / daysUsedAllItems.length)

    // Days used to remove all items which have same category (sold or donated) and status as the sale item
    const sameCategoryItems = props.removals.filter((r) =>  r.saleItem === props.removal.saleItem && r.category === props.removal.category)
    
    const daysUsedAllCategory = sameCategoryItems.filter((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date) >= 0)).map((r) => (Date.parse(r.dateRemoved) - Date.parse(r.date) ) / (1000*60*60*24) + 1)
    
    const daysUsedAllCategoryAverage = Math.round(daysUsedAllCategory.reduce((total, day) => total + day, 0) / daysUsedAllCategory.length)

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
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
            enabled: true
         },
        legend: {
            display: false,
        },
        title: {
            display: false,
            fontSize: 12,
            text: props.removal.saleItem ? 'Days used to sell' : 'Days used to donate'
        },
        scales: {
        yAxes: [{
            ticks: {
            fontSize: 11,
            beginAtZero: true,
            min: 0,
            max: Math.ceil((Math.max(...allAverages) + 1) / 10) * 10
            }    
        }],
        xAxes: [{
            ticks: {
                display: true, //this will remove only the label
                fontSize: 9
            }
        }]
        }
    }

    const markUnSold = async (removal) => {

        try {

            const updateObject = {
                ...removal,
                removed: false,
                dateRemoved: null
            }
    
            setShowNotRemoved(false)
            await props.updateRemoval(removal.id, updateObject)
            
        } catch (error) {
            setShowNotRemoved(false)
            props.showMessage('Error', error.response.data.error, 'negative')
        }
    }
    
    const updateImage = async (id, image) => {

        if (!image) {
            window.scrollTo(0, 0)
            return props.showMessage('Error', 'Select image first!', 'negative') 
        }

        try {

            let formData = new FormData()
            formData.append('image', image)
            setForm(null)
            await props.updateRemovalImage(id, formData)  
            
        } catch (error) {
            setForm(null)
            props.showMessage('Error', error.response.data.error, 'negative')
        }
       
    }
    
    const deleteImage = async (event, id) => {
        event.preventDefault()

        if (!props.removal.image || props.removal.image.substr(props.removal.image.length - 18) === 'No-image-found.jpg') {
            window.scrollTo(0, 0)
            return props.showMessage('Error', 'There is no image to delete!', 'negative') 
        } 
        
        if (confirm('Are you sure you want to delete this image')) 

        try {
            setForm(null) 
            await props.deleteRemovalImage(id)
        } catch (error) {
            setForm(null)
            props.showMessage('Error', error.response.data.error, 'negative')
        }

    }

    const deleteRemoval = async (event, id, name) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${name}`))
     
        try {
            await props.deleteRemoval(id, name)
            props.history.push('/')
        } catch (error) {
            props.showMessage('Error', error.response.data.error, 'negative')
        } 
    }

    return(
        <div>
            <FlashMessage header={props.notifications.header} message={props.notifications.message} status={props.notifications.status}/>
            <div>
                <Title title={props.removal.name} />
            </div>
            <SaleModal />
            <div className={classes.infoarea}>
                    <img src={props.removal.image} className={classes.image}/>
                <div className={classes.contentcontainer}>
                    <div className={classes.contentspacer}>
                        <div className={classes.content}>
                            <div className={classes.contenttitle}>
                                <h4>Details</h4>
                            </div>
                            <ul>
                                <li><span className={classes.subject}>Name:</span> {props.removal.name}</li>
                                <li><span className={classes.subject}>Quantity:</span> {props.removal.quantity}</li>
                                <li><span className={classes.subject}>Locations:</span> {props.removal.location}</li>
                                <li><span className={classes.subject}>Category:</span> {props.removal.category}</li>
                                <li><span className={classes.subject}>Unit value:</span> {props.removal.value}€</li>
                                <li><span className={classes.subject}>Total value:</span> {props.removal.totalValue}€</li>
                                <li><span className={classes.subject}>Type:</span> {props.removal.saleItem ? <span><Icon name="money bill alternate" /> sell</span> : <span><Icon name="gift" /> donate</span>}</li>
                                <li><span className={classes.subject}>Sold at:</span> {props.removal.soldAt}</li>
                            </ul>
                        </div>
                        <div className={classes.content2}>
                            <div className={classes.contenttitle}>
                                <h4>Dimensions</h4>
                            </div>
                            <ul>
                                <li><span className={classes.subject}>Unit length:</span> {props.removal.length} cm</li>
                                <li><span className={classes.subject}>Unit width:</span> {props.removal.width} cm</li>
                                <li><span className={classes.subject}>Unit height:</span> {props.removal.height} cm</li>
                                <li><span className={classes.subject}>Total volume:</span> {props.removal.cbm} m³</li>
                                <li><span className={classes.subject}>Unit weight:</span> {props.removal.weight} kg</li>
                                <li><span className={classes.subject}>Total weight:</span> {props.removal.totalWeight} kg</li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.notes}>
                        <h4>Notes</h4>
                            <p>{props.removal.note}</p>
                    </div>
                </div>
                        {props.removal.removed ?
                            <div className={classes.chart}>
                                <h4>{props.removal.saleItem ? 'Days used to sell' : 'Days used to donate'}</h4>
                                <div className={classes.bar}>
                                    <Bar data={data} options={options} />
                                </div>  
                            </div>
                            :
                            <div className={classes.notremoved}>
                                <div><Icon color='red' name='x' size='huge' /></div>
                                <div>Item is not yet removed</div>
                            </div>
                            }
                <div className={classes.actions}>
                    <h4>Actions</h4>
                    <div className={classes.actionbuttons}>
                    {!props.removal.removed ?
                        <button onClick={() => props.initModal(props.removal)} className={classes.actionbutton}><Icon color='green' name='checkmark' />Mark removed</button> : 
                        <button onClick={() => setRemoveCancel(props.removal)} className={classes.actionbutton}><div className={classes.not}><Icon color='red' name='x' />Mark not removed</div></button>
                        }
                        <Confirm
                        open={showNotRemoved}
                        header={'Mark NOT removed'}
                        confirmButton={'Yes'}
                        content={removalNotToRemove ? `Are you sure you want to mark ${removalNotToRemove.name} not removed?` : null}
                        onCancel={() => setShowNotRemoved(false)}
                        onConfirm={() => markUnSold(removalNotToRemove)}
                    /> 
                    <button onClick={() => setForm('editform')} className={classes.actionbutton} ><Icon name='edit' />Edit details</button>
                    <button onClick={() => setForm('imageform')} className={classes.actionbutton}><Icon name='image outline' />Edit image</button>
                    <button onClick={(event) => deleteRemoval(event, props.removal.id, props.removal.name)} className={classes.actionbutton}><div className={classes.not}><Icon name='trash alternate outline' />Delete removal</div></button>
                    </div>
                </div>
            </div>
            {!form ? null : form === 'editform' ? <EditRemovalForm user={props.logged_user} removal={props.removal} setBack={setForm}/> :
             form === 'imageform' ?
             <PictureForm label={'Select new picture'} title={'Edit removal image'} id={props.removal.id} delete={deleteImage} update={updateImage} setBack={setForm}/> :
             null }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
      removals: state.removals,
      notifications: state.notifications
    }
  }

const mapDispatchToProps = {
    updateRemoval,
    updateRemovalImage,
    deleteRemovalImage,
    deleteRemoval,
    showMessage,
    initModal
}

const ConnectedEditRemoval = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditRemoval)


export default withRouter(ConnectedEditRemoval)