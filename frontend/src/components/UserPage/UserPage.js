import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { updateImage, deleteImage } from '../../reducers/userReducer'
import { showMessage } from '../../reducers/notificationReducer'
import { withRouter } from 'react-router'
import FlashMessage from '../Flash/FlashMessage'
import Title from '../Title/Title'
import ChangePasswordForm from './ChangePasswordForm/ChangePasswordForm'
import PictureForm from '../PictureForm/PictureForm'
import EditLocationForm from './EditLocationForm/EditLocationForm'
import EditSaleLocationForm from './EditSaleLocationForm/EditSaleLocationForm'
import EditCategoryForm from './EditCategoryForm/EditCategoryForm'
import EditDetailsForm from './EditDetailsForm/EditDetailsForm'
import DeleteAccountForm from './DeleteAccountForm/DeleteAccountForm'
import classes from './UserPage.module.css'

const UserPage = (props) => {

  const [form, setForm] = useState(null)

  useEffect(() => {
    setForm(null)
  }, [])

  const updateImage = async (id, image) => {

    if (!image) {
      window.scrollTo(0, 0)
      return props.showMessage('Error', 'Select image first!', 'negative')
    }

    try {

      let formData = new FormData()
      formData.append('image', image)
      setForm(null)
      await props.updateImage(id, formData)

    } catch (error) {
      setForm(null)
      props.showMessage('Error', error.response.data.error, 'negative')
    }
  }

  const deleteImage = async (event, id) => {
    event.preventDefault()

    if (!props.logged_user.image) {
      window.scrollTo(0, 0)
      return props.showMessage('Error', 'There is no image to delete!', 'negative')
    }

    if (confirm('Are you sure you want to delete this image'))

      try {
        setForm(null)
        await props.deleteImage(id)

      } catch (error) {
        setForm(null)
        props.showMessage('Error', error.response.data.error, 'negative')
      }

  }

  return (
    <div>
      <FlashMessage header={props.notifications.header} message={props.notifications.message} status={props.notifications.status}/>
      <div>
        <Title title={'My account'} />
      </div>
      <div className={classes.infoarea}>
        <img src={props.logged_user.image} className={classes.image} data-cy='mainimage'/>
        <div className={classes.contentcontainer}>
          <div className={classes.contentspacer}>
            <div className={classes.content}>
              <div >
                <h4>Details</h4>
              </div>
              <ul>
                <li><span className={classes.subject}>Username:</span> <span data-cy='usernamedetail'>{props.logged_user.username}</span></li>
                <li><span className={classes.subject}>Name:</span>  <span data-cy='namedetail'>{props.logged_user.name}</span></li>
                <li><span className={classes.subject}>Email:</span>  <span data-cy='emaildetail'>{props.logged_user.email}</span></li>
              </ul>
            </div>
            <div className={classes.content}>
              <div>
                <h4>Description</h4>
              </div>
              <ul>
                <li data-cy='descriptiondetail'>{props.logged_user.description}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={classes.contentcontainer}>
          <div className={classes.contentspacer}>
            <div className={classes.content}>
              <div >
                <h4>Locations</h4>
              </div>
              <ul>
                <li><span className={classes.subject}>Own locations:</span> <span data-cy='locationdetail'>{props.logged_user.locations.sort().join(', ')}</span></li>
                <li><span className={classes.subject}>Sale locations:</span> <span data-cy='salelocationdetail'>{props.logged_user.saleLocations.map(l => l.text).sort().join(', ')}</span></li>
              </ul>
            </div>
            <div className={classes.content}>
              <div >
                <h4>Categories</h4>
              </div>
              <ul>
                <li><span data-cy='categorydetail'>{props.logged_user.categories.map(c => c.text).sort().join(', ')}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={classes.actions}>
          <h4>Actions</h4>
          <div className={classes.actionbuttons}>
            <button onClick={() => setForm('editform')} className={classes.actionbutton}><Icon name='edit' />Edit details</button>
            <button onClick={() => setForm('pictureform')} className={classes.actionbutton}><Icon name='image outline' />Edit profile picture</button>
            <button onClick={() => setForm('locationform')} className={classes.actionbutton}><Icon name='home' />Edit locations</button>
            <button onClick={() => setForm('salelocationform')} className={classes.actionbutton}><Icon name='dollar sign' />Edit sale locations</button>
            <button onClick={() => setForm('categoryform')} className={classes.actionbutton}><Icon name='archive' />Edit categories</button>
            <button onClick={() => setForm('passwordform')} className={classes.actionbutton}><Icon name='user secret' />Change password</button>
            <button onClick={() => setForm('deleteaccount')} className={classes.actionbutton}><Icon name='user delete' />Delete account</button>
          </div>
        </div>
      </div>
      {!form ? null : form === 'passwordform' ? <ChangePasswordForm setBack={setForm}/> :
        form === 'pictureform' ? <PictureForm id={props.logged_user.id} delete={deleteImage} label={'Select profile picture'} title={'Edit your profile picture'} update={updateImage} setBack={setForm}/> :
          form === 'locationform' ? <EditLocationForm setBack={setForm} /> :
            form === 'salelocationform' ? <EditSaleLocationForm setBack={setForm} /> :
              form === 'deleteaccount' ? <DeleteAccountForm setBack={setForm}/> :
                form === 'categoryform' ?  <EditCategoryForm setBack={setForm}/> :
                  <EditDetailsForm setBack={setForm}/>}
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
  updateImage,
  deleteImage,
  showMessage
}

const ConnectedUserPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage)

export default withRouter(ConnectedUserPage)