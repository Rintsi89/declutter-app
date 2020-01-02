import React from 'react'
import { connect } from 'react-redux'
import ExportCSV from './ExportCSV'

const Info = (props) => {

    const getExcelData = (removals) => {
        let arrayItems = []
    for (let i = 0; i < removals.length; i++) {
        const excelData = {
            name: removals[i].name,
            category: removals[i].category,
            location: removals[i].location,
            quantity: removals[i].quantity,
            value: removals[i].value,
            volume: removals[i].cbm,
            weigth: removals[i].weigth,
            date: removals[i].date,
            note: removals[i].note,
            image: removals[i].image
        }
        arrayItems.push(excelData)
    }
    return arrayItems
}

    const totalCbm = props.removals.reduce((a, {cbm}) => a + cbm, 0)
    const totalMoney = props.removals.reduce((a, {value}) => a + value, 0)
    const totalQuantity = props.removals.reduce((a, {quantity}) => a + quantity, 0)
    const totalWeight = props.removals.reduce((a, {weigth}) => a + weigth, 0)

    const examples = [
        {
            name: 'of the volume plastig bag',
            volume: 0.02
        },
        {
            name: 'of the volume of Samsonite trolley bag',
            volume: 0.11
        },
        {
            name: 'of the boot volume of the new Volksvagen polo',
            volume: 0.35
        },
        {
            name: 'of the volume of private warehouse cage',
            volume: 2
        },
        {
            name: 'of the boot volume of Ford Transit',
            volume:  6
        },
        {
            name: 'of the boot volume of Volkswagen Crafter',
            volume:  16
        },
        {
            name: 'of the volume of 20-foot shipping container',
            volume:  33
        },
        {
            name: 'of the volume of 40-foot shipping container',
            volume:  67
        }
    ]

    const createExample = () => {
        let exampleToReturn = []
        examples.forEach(e => {
            exampleToReturn.push({...e, difference: e.volume - totalCbm }) 
        })

        const differences = exampleToReturn.filter(d => d.difference > 0)
        const result = differences.length === 0 ? examples[examples.length - 1] : differences.reduce((res, obj) => (obj.difference < res.difference) ? obj : res)     
        const percentage = Math.round(totalCbm  / result.volume  * 100)
        return `Volume of removed items is ${percentage}% ${result.name}`
    }

  return (
    <div>
        <h3>{props.logged_user.username}</h3>
        <p>By decluttering unnecessary items you have:</p>
        <ul>
            <li>Gained {totalMoney}€</li>
            <li>Freed up {totalCbm} m³ of space</li>
            <li>Have {totalQuantity} items less on your way</li>
            <li>Have {totalWeight} kg less to carry when you move!</li>
        </ul>
    <p><em>{createExample()}</em></p>
    {props.removals.length < 1 ? null : 
    <ExportCSV csvData={getExcelData(props.removals)} fileName={'My removals'}/>
    }
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
      removals: state.removals
    }
  }

const ConnectedInfo = connect(
    mapStateToProps,
    null
)(Info)

export default ConnectedInfo

