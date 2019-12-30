import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { updateImage, deleteImage } from '../reducers/userReducer'
import classes from '../styles/EditForm.module.css'

const PictureForm = (props) => {

    const [image, setImage] = useState(null)
    const [forRender, setForRender] = useState(true)

    const handleFileChange = (file) => {
        setImage(file) 
    }

    const resetFile = (event) => {
        event.preventDefault()
        setImage(null)
        setForRender(!forRender)
    }

    const updateImage = (id) => {

        if (!image) {
            return alert('Select image first!')
        }

        let formData = new FormData()
        formData.append('image', image)
        props.updateImage(id, formData)
        setForRender(!forRender)
    }

    const deleteImage = (event, id) => {
        event.preventDefault()
        if (confirm('Are you sure you want to delete profile picture')) {
            props.deleteImage(id)
        }
    }
    
    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
            <h2>Edit your profile picture</h2>
            <Form onSubmit={() => updateImage(props.logged_user.id)}>
                <Form.Group>
                    <Form.Field width={5}>
                    <label>Select profile picture</label>
                    <input key={forRender} type="file" onChange={(e) => handleFileChange(e.target.files[0])}></input>
                    </Form.Field>
                </Form.Group>
                <Button.Group>
                    <Button onClick={resetFile}>Cancel</Button>
                    <Button.Or />
                    <Button positive>Upload new</Button>
                    <Button.Or />
                    <Button negative onClick={(event) => deleteImage(event, props.logged_user.id)}>Delete old</Button>
                </Button.Group>
            </Form>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
    }
  }

const mapDispatchToProps = {
    updateImage,
    deleteImage
}

const ConnectedPictureForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(PictureForm)

export default ConnectedPictureForm