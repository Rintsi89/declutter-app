import React from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ExportCSV from './ExportCSV/ExportCSV'
import classes from './Info.module.css'

const Info = (props) => {

  const getExcelData = (removals) => {
    let arrayItems = []
    for (let i = 0; i < removals.length; i++) {
      const excelData = {
        name: removals[i].name,
        saleItem: removals[i].saleItem,
        removed:  removals[i].removed,
        category: removals[i].category,
        location: removals[i].location,
        quantity: removals[i].quantity,
        unitValue: removals[i].value,
        totalValue: removals[i].totalValue,
        unitLength: removals[i].length,
        unitWidth: removals[i].width,
        unitHeight: removals[i].height,
        totalVolume: removals[i].cbm,
        unitWeigth: removals[i].weight,
        totalWeight: removals[i].totalWeight,
        date: removals[i].date,
        dateRemoved: removals[i].dateRemoved,
        soldAt: removals[i].soldAt,
        note: removals[i].note,
        image: removals[i].image
      }
      arrayItems.push(excelData)
    }
    return arrayItems
  }

  const totalCbm = props.removals.filter(r => r.removed).reduce((a, { cbm }) => a + cbm, 0)
  const totalMoney = props.removals.filter(r => r.removed).reduce((a, { totalValue }) => a + totalValue, 0)
  const totalQuantity = props.removals.filter(r => r.removed).reduce((a, { quantity }) => a + quantity, 0)
  const totalSaleQuantity = props.removals.filter(r => r.removed && r.saleItem).reduce((a, { quantity }) => a + quantity, 0)
  const totalDonatedQuantity = totalQuantity - totalSaleQuantity
  const totalWeight = props.removals.filter(r => r.removed).reduce((a, { totalWeight }) => a + totalWeight, 0)

  const examples = [
    {
      name: 'of the volume plastic bag',
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
      exampleToReturn.push({ ...e, difference: e.volume - totalCbm })
    })

    const differences = exampleToReturn.filter(d => d.difference > 0)
    const result = differences.length === 0 ? examples[examples.length - 1] : differences.reduce((res, obj) => (obj.difference < res.difference) ? obj : res)
    const percentage = Math.round(totalCbm  / result.volume  * 100)
    return `Volume of removed items is ${percentage}% ${result.name}`
  }

  return (
    <div className={classes.container}>
      <h3 className={classes.title}><span data-cy='username'>{props.logged_user.username}</span></h3>
      <p className={classes.subtitle}>By decluttering unnecessary items you have:</p>
      <ul className={classes.list}>
        <li className={classes.listitem}>Gained <span className={classes.highlight} data-cy='money'>{totalMoney.toFixed(2)} €</span></li>
        <li className={classes.listitem}>Freed up <span className={classes.highlight} data-cy='cbm'>{totalCbm.toFixed(2)} m³</span> of space</li>
        <li className={classes.listitem}>Have <span className={classes.highlight} data-cy='quantitydetail'>{totalQuantity.toFixed(0)}</span> items less on your way...</li>
        <li className={classes.listitem}>...from which <span className={classes.highlight} data-cy='totalsalequantity'>{totalSaleQuantity.toFixed(0)}</span> are sold and <span className={classes.highlight} data-cy='totaldonatedquantity'>{totalDonatedQuantity}</span> donated</li>
        <li className={classes.listitem}>Have <span className={classes.highlight} data-cy='weightdetail'>{totalWeight} kg</span> less to carry when you move!</li>
      </ul>
      <p><Icon name="info circle" color='red'/><span data-cy='example' className={classes.example}>{createExample()}</span></p>
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

