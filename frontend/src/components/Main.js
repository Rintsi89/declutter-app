import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { Bar } from 'react-chartjs-2'
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
              max: 10
            }    
          }]
        }
      }

    return (
        <div>
            <h2 className={classes.maintitle}>{props.title}</h2>
            <div className={classes.infoarea}>
                <div className={classes.chart}>
                    <Bar data={data} options={options}/>
                </div>
                <div>
                    <Info user={props.loo}/>
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