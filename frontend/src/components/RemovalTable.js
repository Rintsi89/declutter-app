import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withRouter } from "react-router"
import { deleteRemoval, initializeRemovals } from '../reducers/removalReducer'
import Togglable from './Togglable'
import Pagination from './Pagination'
import RemovalForm from './RemovalForm'
import classes from '../styles/Table.module.css'

const RemovalTable = (props) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage] = useState(10) 
    
    useEffect(() => {
        props.initializeRemovals()
    }, [])

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = props.removals.slice(indexOfFirstRow, indexOfLastRow)
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const deleteRemoval = async (event, id, name) => {
        event.preventDefault()

        if (confirm(`Are you sure you want to delete ${name}`))
     
        try {
            await props.deleteRemoval(id)
        } catch (error) {
            // here props.message
        }
        
    }
    
    const sort = () => currentRows.sort((a, b) => {
   
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
    <div>
    <div className={classes.maintable}>
        <div className={classes.formarea}>
        <Togglable buttonLabel="Add new" >
            <RemovalForm user={props.logged_user} />
        </Togglable>
        </div>
        {currentRows.length < 1 ? null :
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
                        <th>Sold at</th>
                        <th>Delete</th>
                    </tr>
                    {sort().map(r =>
                    <tr key={r.id}>
                        <td>
                            {r.date}
                        </td>
                        <td>
                            {r.name} <Link to={`/removals/${r.id}`}><Icon name='edit' /></Link>
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
                            {r.totalValue}€
                        </td>
                        <td>
                            {r.cbm} m³
                        </td>
                        <td>
                            {r.totalWeigth} kg
                        </td>
                        <td>
                            {r.image ? <a href={r.image}>Image</a> : null }
                        </td>
                        <td>
                            {r.soldAt}
                        </td>
                        <td>
                            <button className={classes.button} onClick={() => deleteRemoval(event, r.id, r.name)}><Icon name="trash alternate outline"></Icon></button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        }
        </div>
        <Pagination rowsPerPage={rowsPerPage} totalRows={props.removals.length} paginate={paginate}/>
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


export default withRouter(ConnectedRemovalTable)
