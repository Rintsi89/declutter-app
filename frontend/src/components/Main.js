import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { Bar } from 'react-chartjs-2'
import Header from './Header'
import Info from './Info'
import RemovalTable from './RemovalTable'
import { setTitle } from '../reducers/titleReducer'
import classes from '../styles/Main.module.css'

const Main = (props) => {

    useEffect(() => {
        props.setTitle('My removals')
    }, [])

    const categories = [...new Set(props.removals.map(r => r.category))]

    const sumCategories = () => {
        let total = []

        categories.forEach(c => {
            const totalPerCategory = props.removals.filter(({ category }) => category === c).reduce((a, {cbm}) => a + cbm, 0)
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
              max: Math.ceil((Math.max(...totalCbms) + 1) / 10) * 10
            }    
          }]
        }
      }

    return (
        <div>
            <Header />
            <div className={classes.maintitle}>
                <h2 className={classes.mainh2}>{props.title}</h2>
            </div>
            <div className={classes.infoarea}>
                <div className={classes.chart}>
                    <Bar data={data} options={options}/>
                </div>
                <div>
                    <Info />
                </div>
            </div>
                <RemovalTable />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      removals: state.removals,
      title: state.title
    }
  }

const mapDispatchToProps = {
    setTitle
}

const ConnectedMainPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)


export default ConnectedMainPage