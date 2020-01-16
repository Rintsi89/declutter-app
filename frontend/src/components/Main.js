import React from 'react'
import { connect } from 'react-redux'
import { Bar } from 'react-chartjs-2'
import Title from './Title'
import Info from './Info'
import RemovalTable from './RemovalTable'
import FlashMessage from './Flash/FlashMessage'
import classes from '../styles/Main.module.css'

const Main = (props) => {

    const categories = [...new Set(props.removals.map(r => r.category))]
    const removedItems = props.removals.filter(r => r.removed)

    const sumCategories = () => {
        let total = []

        categories.forEach(c => {
            const totalPerCategory = removedItems.filter(({ category }) => category === c).reduce((a, {cbm}) => a + cbm, 0)
            total.push(totalPerCategory)
        })
  
        return total
    }

    const totalCbms = sumCategories()

    const data = {
        labels: categories,
        datasets: [{
            data: totalCbms,
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
              max: Math.max(...totalCbms) < 10 ? Math.ceil(Math.max(...totalCbms) + 1) : Math.ceil((Math.max(...totalCbms) + 1) / 10) * 10
            }    
          }]
        }
      }

    return (
        <div>
            <Title title={'My removals'} />
            <div className={classes.infoarea}>
                <div className={classes.chart}>
                    <Bar data={data} options={options}/>
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

const ConnectedMainPage = connect(
    mapStateToProps,
    null
)(Main)


export default ConnectedMainPage