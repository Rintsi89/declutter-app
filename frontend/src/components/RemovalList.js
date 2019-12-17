import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { initializeRemovals } from '../reducers/removalReducer'

const RemovalList = (props) => {

    useEffect(() => {
        props.initializeRemovals()
    }, [])

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
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Removal date</th>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Size</th>
                        <th>Weight</th>
                        <th>Image</th>
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
                            {r.quantity}
                        </td>
                        <td>
                            {r.value}
                        </td>
                        <td>
                            {r.cbm}
                        </td>
                        <td>
                            {r.weight}
                        </td>
                        <td>
                            {r.image}
                        </td>
                    </tr>)}
                </tbody>
            </table>
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
    initializeRemovals
}

const ConnectedRemovalList = connect(
    mapStateToProps,
    mapDispatchToProps
)(RemovalList)


export default ConnectedRemovalList