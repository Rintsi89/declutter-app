import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import Header from '../Header/Header'
import Title from '../Title/Title'
import Pagination from '../Pagination/Pagination'
import Card from './Card/Card'
import classes from './Gallery.module.css'

const Gallery = (props) => {

  if (!props) {
    return null
  }

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

  const [currentPage, setCurrentPage] = useState(1)
  const [imagesPerPage] = useState(10)
  const indexOfLastImage = currentPage * imagesPerPage
  const indexOfFirstImage = indexOfLastImage- imagesPerPage
  const currentImages = sort().slice(indexOfFirstImage, indexOfLastImage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const projectCards = () => {
    return currentImages.map(r =>
      <Card key={r.id} image={r.image} id={r.id} name={r.name} date={r.date} removed={r.removed}/>
    )
  }

  return (
    <div>
      <Header />
      <Title title={'My gallery'} />
      <div className={classes.gallery}>
        {props.removals.length === 0 ? 
        <div>
          <Icon name="info circle" color='red'/> 
          You haven't add any removals yet. Start by adding some removals. Both removed and not removed items will be shown here.
        </div> :
          projectCards()
        }
      </div>
      <Pagination rowsPerPage={imagesPerPage} totalRows={props.removals.length} paginate={paginate} currentPage={currentPage}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    logged_user: state.logged_user,
    removals: state.removals
  }
}


const ConnectedGallery = connect(
  mapStateToProps,
  null
)(Gallery)

export default ConnectedGallery