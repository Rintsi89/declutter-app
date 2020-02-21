import React from 'react'
import { connect } from 'react-redux'
import { Bar } from 'react-chartjs-2'
import { Icon } from 'semantic-ui-react'
import { initializeRemovals } from '../../reducers/removalReducer'
import Header from '../Header/Header'
import Title from '../Title/Title'
import Info from './Info/Info'
import RemovalTable from './RemovalTable/RemovalTable'
import FlashMessage from '../Flash/FlashMessage'
import classes from './Main.module.css'

const Main = (props) => {

  const sumCategories = () => {
    
    
    const removedItems = props.removals.filter(r => r.removed)
    const categories = [...new Set(removedItems.map(r => r.category))]
    let total = []
    
    categories.forEach(c => {
      const totalPerCategory = removedItems.filter(({ category }) => category === c).reduce((a, b) => ({ cbm: a.cbm + b.cbm, category: b.category }))
      total.push(totalPerCategory)
    })
    
    return total
    
  }

  const totalCbms = sumCategories().sort((a, b) => (a.cbm > b.cbm) ? -1 : 1);
  const categories = [...new Set(totalCbms.map(r => r.category))]
  const cbms = [...new Set(totalCbms.map(r => r.cbm))]
  
  const data = {
    labels: categories,
    datasets: [{
      data: cbms,
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#A2FB48',
        '#7DCEA0',
        '#2E4053',
        '#4A235A',
        '#7D6608 '
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#A2FB48',
        '#7DCEA0',
        '#2E4053',
        '#4A235A',
        '#7D6608'
      ]
    }]
  }

  const options = {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Decluttering by category in cbm (m³)'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
          max: Math.max(...cbms) < 10 ? Math.ceil(Math.max(...cbms) + 1) : Math.ceil((Math.max(...cbms) + 1) / 10) * 10
        }
      }]
    }
  }

  return (
    <div>
      <Header />
      <Title title={'My removals'} />
      <div className={classes.infoarea}>
        <div className={classes.chart}>
          {props.removals.filter(r => r.removed).length === 0 ?
          <div>
            <Icon name="info circle" color='red'/> 
            You haven't remove anything yet. Start by adding some removals. Once they are marked as removed, you'll see a bar chart here.
          </div> : 
            <Bar data={data} options={options}/>
          }
        </div>
        <div className={classes.details}>
          <Info />
        </div>
      </div>
      <FlashMessage header={props.notifications.header} message={props.notifications.message} status={props.notifications.status}/>
      <RemovalTable />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    removals: state.removals,
    notifications: state.notifications
  }
}

const mapDispatchToProps = {
  initializeRemovals
}

const ConnectedMainPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)


export default ConnectedMainPage