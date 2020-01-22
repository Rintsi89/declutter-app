import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Icon, Confirm } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { deleteRemoval, initializeRemovals, updateRemoval } from '../../../reducers/removalReducer'
import { initModal } from '../../../reducers/removalModalReducer'
import { showMessage } from '../../../reducers/notificationReducer'
import Pagination from '../../Pagination/Pagination'
import RemovalForm from './RemovalForm/RemovalForm'
import SaleModal from '../../SaleModal/SaleModal'
import classes from './RemovalTable.module.css'

const RemovalTable = (props) => {

  const [showForm, setShowForm] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [removalToDelete, setRemovalToDelete] = useState(null)
  const [showNotRemoved, setShowNotRemoved] = useState(false)
  const [removalNotToRemove, setRemovalNotToRemove] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  useEffect(() => {
    props.initializeRemovals()
  }, [])

  const sortBy = [{
    prop:'date',
    direction: -1
  },{
    prop:'name',
    direction: 1
  }]

  // Sort removals by date and name. It first sorts result one time and then another time with different property.
  const sort = () => props.removals.sort((a, b) => {

    let i = 0, result = 0

    while(i < sortBy.length && result === 0) {
      result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0))
      i++
    }
    return result
  })


  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = sort().slice(indexOfFirstRow, indexOfLastRow)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const setRemoveCancel = (removal) => {
    setRemovalNotToRemove(removal)
    setShowNotRemoved(true)
  }

  const markUnSold = async (removal) => {

    try {

      const updateObject = {
        ...removal,
        removed: false,
        dateRemoved: null
      }

      await props.updateRemoval(removal.id, updateObject)
      setShowNotRemoved(false)
      window.scrollTo(0, document.body.scrollHeight)

    } catch (error) {
      setShowNotRemoved(false)
      window.scrollTo(0, 0)
      props.showMessage('Error', error.response.data.error, 'negative')
    }
  }

  const setDelete = (removal) => {
    setRemovalToDelete(removal)
    setShowDelete(true)
  }

  const deleteRemoval = async (id, name) => {

    try {
      await props.deleteRemoval(id, name)
      window.scrollTo(0, document.body.scrollHeight)
      setShowDelete(false)
    } catch (error) {
      window.scrollTo(0, document.body.scrollHeight)
      setShowDelete(false)
      props.showMessage('Error', error.response.data.error, 'negative')
    }

  }

  return (
    <div>
      <div className={classes.maintable}>
        <SaleModal />
        <div className={classes.formarea}>
          {!showForm ?
            <button className={classes.addbutton} onClick={() => setShowForm(!showForm)}>
              <Icon name="add circle" size='large'/> Add new
            </button> :
            <RemovalForm user={props.logged_user} hide={() => setShowForm(!showForm)}/>
          }
        </div>
        {currentRows.length < 1 ? null :
          <table className={classes.removals}>
            <tbody>
              <tr>
                <th>Created at</th>
                <th>Item</th>
                <th>Category</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Removed</th>
                <th>Type</th>
                <th>Sold at</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
              {currentRows.map(r =>
                <tr key={r.id}>
                  <td>
                    {moment(r.date).format('DD.MM.YYYY')}
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
                    {r.removed ?
                      <div><Icon color='green' name='checkmark' /> Yes</div> :
                      <div><Icon color='red' name='x' /> No</div>}
                  </td>
                  <td>
                    {r.saleItem ?
                      <span><Icon name="money bill alternate" /> sell</span>
                      : <span><Icon name="gift" /> donate</span>
                    }
                  </td>
                  <td>
                    {r.soldAt}
                  </td>
                  <td>
                    {!r.removed ?
                      <button className={classes.removebutton} onClick={() => props.initModal(r)}><Icon color='green' name='checkmark' />Mark removed</button>
                      : <button className={classes.removebutton} onClick={() => setRemoveCancel(r)}><div className={classes.not}><Icon color='red' name='x' />Mark not removed</div></button>}
                    <Confirm
                      open={showNotRemoved}
                      header={'Mark NOT removed'}
                      confirmButton={'Yes'}
                      content={removalNotToRemove ? `Are you sure you want to mark ${removalNotToRemove.name} not removed?` : null}
                      onCancel={() => setShowNotRemoved(false)}
                      onConfirm={() => markUnSold(removalNotToRemove)}
                    />
                  </td>
                  <td>
                    <button className={classes.button} onClick={() => setDelete(r)}><Icon name="trash alternate outline" /></button>
                    <Confirm
                      open={showDelete}
                      header={'Delete removal'}
                      confirmButton={'Yes'}
                      content={removalToDelete ? `Are you sure you want to delete ${removalToDelete.name}` : null}
                      onCancel={() => setShowDelete(false)}
                      onConfirm={() => deleteRemoval(removalToDelete.id, removalToDelete.name)}
                    />
                  </td>
                </tr>)}
            </tbody>
          </table>
        }
      </div>
      <Pagination rowsPerPage={rowsPerPage} totalRows={props.removals.length} paginate={paginate} currentPage={currentPage}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    removals: state.removals,
    logged_user: state.logged_user,
  }
}

const mapDispatchToProps = {
  deleteRemoval,
  initializeRemovals,
  updateRemoval,
  initModal,
  showMessage
}


export default connect(mapStateToProps, mapDispatchToProps)(RemovalTable)
