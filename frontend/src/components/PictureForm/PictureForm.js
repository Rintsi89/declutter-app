import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import classes from './PictureForm.module.css'

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
    props.setBack(null)
  }

  return (
    <div className={classes.container}>
      <div className={classes.formarea}>
        <h3 className={classes.title}>{props.title}</h3>
        <p>Image must be <em><b>.jpg</b></em> or <em><b>.png</b></em> format</p>
        <p>Maximum file size is <em><b>4 mb</b></em></p>
        <Form onSubmit={() => props.update(props.id, image)}>
          <Form.Group>
            <Form.Field width={5}>
              <label>{props.alert}</label>
              <input key={forRender} type="file" onChange={(e) => handleFileChange(e.target.files[0])} />
            </Form.Field>
          </Form.Group>
          <Button.Group>
            <Button onClick={resetFile}>Cancel</Button>
            <Button.Or />
            <Button primary>Upload new</Button>
            <Button.Or />
            <Button negative onClick={(event) => props.delete(event, props.id)}>Delete old</Button>
          </Button.Group>
        </Form>
      </div>
    </div>
  )
}


export default PictureForm