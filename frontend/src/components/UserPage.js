import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Image, Item, Icon } from 'semantic-ui-react'
import { updateImage, deleteImage } from '../reducers/userReducer'
import { withRouter } from "react-router"
import Header from './Header'
import Title from './Title'
import PasswordForm from './PasswordForm'
import PictureForm from './PictureForm'
import LocationForm from './LocationForm'
import CategoryForm from './CategoryForm'
import EditForm from './EditForm'
import DeleteAccountPage from './DeleteAccountPage'
import classes from '../styles/User.module.css'

const UserPage = (props) => {

    const [form, setForm] = useState(null)

    useEffect(() => {
        setForm(null)
    }, [])

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
        if (!props.logged_user.image) {
            return alert('There is no image to delete')
        } else { 
            confirm('Are you sure you want to delete this picture') 
            props.deleteImage(id)
        }
    }

    return (
        <div>
            <div>
                <Header />
                <Title title={'My account'} />
            </div>
            <div className={classes.infoarea}>
                <Item.Group>
                    <Item>
                    <Item.Image size='small' src={props.logged_user.image} />
                    <Item.Content className={classes.content}>
                        <Item.Header as='a'>{props.logged_user.username}</Item.Header>
                        <Item.Meta>{props.logged_user.description}</Item.Meta>
                        <Item.Description>Name: {props.logged_user.name}</Item.Description>
                        <Item.Description>Locations: {props.logged_user.locations.join(", ")}</Item.Description>
                        <Item.Extra>You have currently {props.removals.length} removals</Item.Extra>
                    </Item.Content>
                    <Item.Content>
                        <Item.Header as='a'>Actions</Item.Header>
                        <Item.Meta>What you would like to do with your account?</Item.Meta>
                        <div>
                        <Item.Description><Icon name='edit' /><button onClick={() => setForm('editform')}>Edit personal details</button></Item.Description>
                        </div>
                        <Item.Description><Icon name='image outline' /><button onClick={() => setForm('pictureform')}>Edit profile picture</button></Item.Description>
                        <Item.Description><Icon name='home' /><button onClick={() => setForm('locationform')}>Edit locations</button></Item.Description>
                        <Item.Description><Icon name='archive' /><button onClick={() => setForm('categoryform')}>Edit categories</button></Item.Description>
                        <Item.Description><Icon name='user secret' /><button onClick={() => setForm('passwordform')}>Change password</button></Item.Description>
                        <Item.Description><Icon name='trash alternate outline' /><button onClick={() => setForm('deleteaccount')}>Delete account</button></Item.Description>
                    </Item.Content>
                    </Item>
                </Item.Group>
            </div>
            {!form ? null : form === 'passwordform' ? <PasswordForm /> :
             form === 'pictureform' ? <PictureForm id={props.logged_user.id} delete={deleteImage} label={'Select profile picture'} title={'Edit your profile picture'} update={updateImage}/> :
             form === 'locationform' ? <LocationForm /> :
             form === 'deleteaccount' ? <DeleteAccountPage /> :
             form === 'categoryform' ?  <CategoryForm /> :
             <EditForm />}
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
    updateImage,
    deleteImage
}

const ConnectedUserPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPage)

export default withRouter(ConnectedUserPage)