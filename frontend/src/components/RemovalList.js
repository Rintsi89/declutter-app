import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import {Doughnut} from 'react-chartjs-2';
import { initializeRemovals, deleteRemoval } from '../reducers/removalReducer'
import classes from '../styles/Chart.module.css'

const RemovalList = (props) => {

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

    const categories = [...new Set(props.removals.map(r => r.category))]

    const sumCategories = () => {
        let total = []

        categories.forEach(c => {
            const totalPerCategory = props.removals.filter(({ category }) => category === c).reduce((a, {cbm}) => a + cbm, 0)
            total.push(totalPerCategory)
        })
        return total
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

const data = {
    labels: categories,
	datasets: [{
		data: sumCategories(),
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
  };
    return (
        <div>
            <div className={classes.chart}>
                
            <Doughnut
  data={data}
/>
            </div>
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
                        <td>
                            <button onClick={() => deleteRemoval(event, r.id, r.name)}>Delete</button>
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
    initializeRemovals,
    deleteRemoval
}

const ConnectedRemovalList = connect(
    mapStateToProps,
    mapDispatchToProps
)(RemovalList)


export default ConnectedRemovalList