import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { updateImage, deleteImage } from '../reducers/userReducer'
import { showMessage } from '../reducers/notificationReducer'
import { withRouter } from "react-router"
import FlashMessage from './Flash/FlashMessage'
import Title from './Title'
import PasswordForm from './PasswordForm'
import PictureForm from './PictureForm'
import LocationForm from './LocationForm'
import SaleLocationForm from './SaleLocationForm'
import CategoryForm from './CategoryForm'
import EditForm from './EditForm'
import DeleteAccountPage from './DeleteAccountPage'
import classes from '../styles/User.module.css'

const UserPage = (props) => {

    const [form, setForm] = useState(null)

    useEffect(() => {
        setForm(null)
    }, [])

    const updateImage = async (id, image) => {

        if (!image) {
            return alert('Select image first!')
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

        if (!props.logged_user.image || props.logged_user.image.substr(props.logged_user.image.length - 18) === 'No-image-found.jpg') {
            return alert('There is no image to delete')
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
                    <img size='small' src={props.logged_user.image} className={classes.image}/>
                    <div className={classes.contentcontainer}>
                        <div className={classes.contentspacer}>
                            <div className={classes.content}>
                                <div >
                                    <h4>Details</h4>
                                </div>
                                <ul>
                                    <li><span className={classes.subject}>Username:</span> {props.logged_user.username}</li>
                                    <li><span className={classes.subject}>Name:</span>  {props.logged_user.name}</li>
                                    <li><span className={classes.subject}>Email:</span>  {props.logged_user.email}</li>
                                </ul>
                            </div>
                            <div className={classes.content}>
                                <div>
                                    <h4>Description</h4>
                                </div>
                                <ul>
                                    <li>{props.logged_user.description}</li>
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
                                    <li><span className={classes.subject}>Own locations:</span> {props.logged_user.locations.join(", ")}</li>
                                    <li><span className={classes.subject}>Sale locations:</span> {props.logged_user.saleLocations.map(l => l.text).join(", ")}</li>
                                </ul>
                            </div>
                            <div className={classes.content}>
                                <div >
                                    <h4>Categories</h4>
                                </div>
                                <ul>
                                    <li>{props.logged_user.categories.map(c => c.text).join(", ")}</li>
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
            {!form ? null : form === 'passwordform' ? <PasswordForm /> :
             form === 'pictureform' ? <PictureForm id={props.logged_user.id} delete={deleteImage} label={'Select profile picture'} title={'Edit your profile picture'} update={updateImage} setBack={setForm}/> :
             form === 'locationform' ? <LocationForm setBack={setForm} /> :
             form === 'salelocationform' ? <SaleLocationForm /> :
             form === 'deleteaccount' ? <DeleteAccountPage /> :
             form === 'categoryform' ?  <CategoryForm /> :
             <EditForm setBack={setForm}/>}
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