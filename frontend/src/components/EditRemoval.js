import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Image, Item, Icon } from 'semantic-ui-react'
import { withRouter } from "react-router"
import { updateImage, deleteImage, deleteRemoval } from '../reducers/removalReducer'
import Title from './Title'
import PictureForm from './PictureForm'
import EditRemovalForm from './EditRemovalForm'
import classes from '../styles/User.module.css'

const EditRemoval = (props) => {
    
    const [form, setForm] = useState(null)
    
    if (!props.removal) {
        return null
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
                    <Item.Content>
                        <Item.Header as='a'>Actions</Item.Header>
                        <Item.Meta>What you would like to do with your account?</Item.Meta>
                        <div>
                            <Item.Description><Icon name='edit' /><button onClick={() => setForm('editform')}>Edit removal details</button></Item.Description>
                        </div>
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
    updateImage,
    deleteImage,
    deleteRemoval
}

const ConnectedEditRemoval = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditRemoval)


export default withRouter(ConnectedEditRemoval)