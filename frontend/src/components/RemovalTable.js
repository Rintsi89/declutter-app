import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { deleteRemoval, initializeRemovals } from '../reducers/removalReducer'
import Togglable from './Togglable'
import RemovalForm from './RemovalForm'
import classes from '../styles/Table.module.css'

const RemovalTable = (props) => {

    useEffect(() => {
        props.initializeRemovals()
    }, [])
    
    const deleteRemoval = async (event, id, name) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${name}`))
     
        try {
            await props.deleteRemoval(id)
        } catch (error) {
            // here props.message
        }
        
    }

    const sort = () => props.removals.sort((a, b) => {
   
        let dateA = a.date.toUpperCase()
        let dateB = b.date.toUpperCase()

        if (dateA < dateB) {
            return 1
        }

        if (dateA > dateB) {
            return -1
        }
    
        return 0
    })

  return (
    
    <div className={classes.maintable}>
        <div className={classes.formarea}>
        <Togglable buttonLabel="Add new" >
            <RemovalForm user={props.logged_user} />
        </Togglable>
        </div>
         <table className={classes.removals}>
                <tbody>
                    <tr>
                        <th>Removal date</th>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Size</th>
                        <th>Weight</th>
                        <th>Image</th>
                        <th>Notes</th>
                        <th>Delete</th>
                    </tr>
                    {sort().map(r =>
                    <tr key={r.id}>
                        <td>
                            {r.date}
                        </td>
                        <td>
                            {r.name}
                        </td>
                        <td>
                            {r.category}
                        </td>
                        <td>
                            {r.location}
                        </td>
                        <td>
                            {r.quantity}
                        </td>
                        <td>
                            {r.value}€
                        </td>
                        <td>
                            {r.cbm} m³
                        </td>
                        <td>
                            {r.weigth} kg
                        </td>
                        <td>
                            {r.image ? <a href={r.image}>Image</a> : null }
                        </td>
                        <td>
                            {r.note}
                        </td>
                        <td>
                            <button className={classes.button} onClick={() => deleteRemoval(event, r.id, r.name)}><Icon name="trash alternate outline"></Icon></button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      removals: state.removals,
      logged_user: state.logged_user
    }
  }

const mapDispatchToProps = {
    deleteRemoval,
    initializeRemovals
}

const ConnectedRemovalTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(RemovalTable)


export default ConnectedRemovalTable
