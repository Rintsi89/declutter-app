import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon } from 'semantic-ui-react'
import { useField } from '../hooks'
import { addCategory, deleteCategory } from '../reducers/userReducer'
import classes from '../styles/EditForm.module.css'
import classes2 from '../styles/Table.module.css'

const CategoryForm = (props) => {

    const category = useField('text', 'category', 'Type new category', '')

    const resetForm = (event) => {
        event.preventDefault()
        category.reset()
    }

    const addCategory = async (id) => {
        event.preventDefault()

        if (!category.attributes.value) {
            return alert('You must type category name!')
        }

        const newCategory = {
            key: category.attributes.value,
            text: category.attributes.value,
            value: category.attributes.value
        }

        try {
            await props.addCategory(id, newCategory)
            category.reset()
        } catch (error) {
            // here props.message
        }
        
    }

    const deleteCategory = async (event, id, category) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${category}`))
     
        try {
            await props.deleteCategory(id, { category: category })
        } catch (error) {
            // here props.message
        }
        
    }

    return (
        <div className={classes.container}>
            <div className={classes.formarea}>
            <h2>Edit your categories</h2>
            <p>Your current categories are:</p>
            <ul>
                {props.logged_user.categories.map(c => 
                <li key={c.value}>
                    {c.value} 
                    <button className={classes2.button} onClick={() => deleteCategory(event, props.logged_user.id, c.value)}>
                    <Icon name="trash alternate outline"></Icon></button>
                </li>)}
            </ul>
            <Form onSubmit={() => addCategory(props.logged_user.id)}>
                <Form.Group>
                    <Form.Field width={5}>
                    <label>Add new category</label>
                    <input {...category.attributes}></input>
                    </Form.Field>
                </Form.Group>
                <Button.Group>
                    <Button onClick={(event) => resetForm(event)}>Cancel</Button>
                    <Button.Or />
                    <Button positive>Save</Button>
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
    addCategory,
    deleteCategory
}

const ConnectedCategoryForm= connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryForm)

export default ConnectedCategoryForm