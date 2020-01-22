import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon } from 'semantic-ui-react'
import { useField } from '../../../hooks'
import { addCategory, deleteCategory } from '../../../reducers/userReducer'
import { showMessage } from '../../../reducers/notificationReducer'
import classes from './EditCategoryForm.module.css'

const EditCategoryForm = (props) => {

  const category = useField('text', 'category', 'Type new category', '')

  const resetForm = (event) => {
    event.preventDefault()

    category.reset()
    props.setBack(null)
    window.scrollTo(0, 0)
  }

  const addCategory = async (id) => {
    event.preventDefault()

    if (!category.attributes.value) {
      return alert('You must type category name!')
    }

    try {

      const newCategory = {
        key: category.attributes.value,
        text: category.attributes.value,
        value: category.attributes.value
      }

      props.setBack(null)
      window.scrollTo(0, 0)
      await props.addCategory(id, newCategory)

    } catch (error) {
      window.scrollTo(0, 0)
      props.showMessage('Error', error.response.data.error, 'negative')
    }

  }

  const deleteCategory = async (event, id, category) => {
    event.preventDefault()

    if (confirm(`Are you sure you want to delete ${category}`))

      try {
        props.setBack(null)
        window.scrollTo(0, 0)
        await props.deleteCategory(id, { category: category })
      } catch (error) {
        window.scrollTo(0, 0)
        props.showMessage('Error', error.response.data.error, 'negative')
      }

  }

  return (
    <div className={classes.container}>
      <div className={classes.formarea}>
        <h3 className={classes.title}>Edit your categories</h3>
        <p><em><b>Your current categories are:</b></em></p>
        <ul className={classes.categories}>
          {props.logged_user.categories.map(c => c.value).sort().map(c =>
            <li key={c}>
              {c}
              <button className={classes.button} onClick={() => deleteCategory(event, props.logged_user.id, c)}>
                <Icon name="trash alternate outline" />
              </button>
            </li>)}
        </ul>
        <Form onSubmit={() => addCategory(props.logged_user.id)}>
          <Form.Group>
            <Form.Field width={5}>
              <label>Add new category</label>
              <input {...category.attributes} required />
            </Form.Field>
          </Form.Group>
          <Button.Group>
            <Button onClick={(event) => resetForm(event)}>Cancel</Button>
            <Button.Or />
            <Button primary>Save</Button>
          </Button.Group>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    logged_user: state.logged_user,
    notifications: state.notifications
  }
}

const mapDispatchToProps = {
  addCategory,
  deleteCategory,
  showMessage
}

const ConnectedEditCategoryForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCategoryForm)

export default ConnectedEditCategoryForm