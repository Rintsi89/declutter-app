import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Confirm } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import { withRouter } from 'react-router'
import { updateRemovalImage, deleteRemovalImage, deleteRemoval, updateRemoval } from '../../reducers/removalReducer'
import { showMessage } from '../../reducers/notificationReducer'
import { initModal } from '../../reducers/removalModalReducer'
import SaleModal from '../SaleModal/SaleModal'
import FlashMessage from '../Flash/FlashMessage'
import Title from '../Title/Title'
import PictureForm from '../PictureForm/PictureForm'
import EditRemovalForm from './EditRemovalForm/EditRemovalForm'
import classes from './/RemovalPage.module.css'

const RemovalPage = (props) => {

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
      window.scrollTo(0, 0)
      await props.updateRemovalImage(id, formData)

    } catch (error) {
      setForm(null)
      window.scrollTo(0, 0)
      props.showMessage('Error', error.response.data.error, 'negative')
    }

  }

  const deleteImage = async (event, id) => {
    event.preventDefault()

    if (!props.removal.image) {
      window.scrollTo(0, 0)
      return props.showMessage('Error', 'There is no image to delete!', 'negative')
    }

    if (confirm('Are you sure you want to delete this image'))

      try {
        setForm(null)
        window.scrollTo(0, 0)
        await props.deleteRemovalImage(id)
      } catch (error) {
        setForm(null)
        window.scrollTo(0, 0)
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
        <img src={props.removal.image} className={classes.image} data-cy='mainimage' />
        <div className={classes.contentcontainer}>
          <div className={classes.contentspacer}>
            <div className={classes.content}>
              <div className={classes.contenttitle}>
                <h4>Details</h4>
              </div>
              <ul>
                <li><span className={classes.subject}>Name:</span> <span data-cy='namedetail'>{props.removal.name}</span></li>
                <li><span className={classes.subject}>Quantity:</span> <span data-cy='quantitydetail'>{props.removal.quantity}</span></li>
                <li><span className={classes.subject}>Location:</span> <span data-cy='locationdetail'>{props.removal.location}</span></li>
                <li><span className={classes.subject}>Category:</span> <span data-cy='categorydetail'>{props.removal.category}</span></li>
                <li><span className={classes.subject}>Unit value:</span> <span data-cy='valuedetail'>{props.removal.value}</span>€</li>
                <li><span className={classes.subject}>Total value:</span> <span data-cy='totalvaluedetail'>{props.removal.totalValue}</span>€</li>
                <li><span className={classes.subject}>Type:</span> <span data-cy='typedetail'>{props.removal.saleItem ? <span><Icon name="money bill alternate" /> sell</span> : <span><Icon name="gift" /> donate</span>}</span></li>
                <li><span className={classes.subject}>Sold at:</span> <span data-cy='solddetail'>{props.removal.soldAt}</span></li>
              </ul>
            </div>
            <div className={classes.content2}>
              <div className={classes.contenttitle}>
                <h4>Dimensions</h4>
              </div>
              <ul>
                <li><span className={classes.subject}>Unit length:</span> <span data-cy='lengthdetail'>{props.removal.length}</span> cm</li>
                <li><span className={classes.subject}>Unit width:</span> <span data-cy='widthdetail'>{props.removal.width}</span> cm</li>
                <li><span className={classes.subject}>Unit height:</span> <span data-cy='heightdetail'>{props.removal.height}</span> cm</li>
                <li><span className={classes.subject}>Total volume:</span> <span data-cy='volumedetail'>{props.removal.cbm}</span> m³</li>
                <li><span className={classes.subject}>Unit weight:</span> <span data-cy='weightdetail'>{props.removal.weight}</span> kg</li>
                <li><span className={classes.subject}>Total weight:</span> <span data-cy='totalweightdetail'>{props.removal.totalWeight}</span> kg</li>
              </ul>
            </div>
          </div>
          <div className={classes.notes}>
            <h4>Notes</h4>
            <p><span data-cy='notedetail'>{props.removal.note}</span></p>
          </div>
        </div>
        {props.removal.removed ?
          <div className={classes.chart}>
            <h4>{props.removal.saleItem ? 'Days used to sell' : 'Days used to donate'}</h4>
            <div className={classes.bar} data-cy='bar'>
              <Bar data={data} options={options}  />
            </div>
          </div>
          :
          <div className={classes.notremoved} data-cy='note'>
            <div><Icon color='red' name='x' size='huge' /></div>
            <div>Item is not yet removed</div>
          </div>
        }
        <div className={classes.actions}>
          <h4>Actions</h4>
          <div className={classes.actionbuttons}>
            {!props.removal.removed ?
              <button onClick={() => props.initModal(props.removal)} className={classes.actionbutton} data-cy='removed'><Icon color='green' name='checkmark' />Mark removed</button> :
              <button onClick={() => setRemoveCancel(props.removal)} className={classes.actionbutton} data-cy='notremoved'><div className={classes.not}><Icon color='red' name='x' />Mark not removed</div></button>
            }
            <Confirm
              open={showNotRemoved}
              header={'Mark NOT removed'}
              confirmButton={'Yes'}
              content={removalNotToRemove ? `Are you sure you want to mark ${removalNotToRemove.name} not removed?` : null}
              onCancel={() => setShowNotRemoved(false)}
              onConfirm={() => markUnSold(removalNotToRemove)}
              data-cy='modal'
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

const ConnectedRemovalPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RemovalPage)


export default withRouter(ConnectedRemovalPage)