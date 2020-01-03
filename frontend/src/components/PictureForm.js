import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
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

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
            <h2>{props.title}</h2>
            <Form onSubmit={() => props.update(props.id, image, setForRender)}>
                <Form.Group>
                    <Form.Field width={5}>
                    <label>{props.alert}</label>
                    <input key={forRender} type="file" onChange={(e) => handleFileChange(e.target.files[0])}></input>
                    </Form.Field>
                </Form.Group>
                <Button.Group>
                    <Button onClick={resetFile}>Cancel</Button>
                    <Button.Or />
                    <Button positive>Upload new</Button>
                    <Button.Or />
                    <Button negative onClick={(event) => props.delete(event, props.id)}>Delete old</Button>
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

const ConnectedPictureForm= connect(
    mapStateToProps,
    null
)(PictureForm)

export default ConnectedPictureForm