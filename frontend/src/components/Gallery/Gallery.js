import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Card, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Title from '../Title/Title'
import Pagination from '../Pagination/Pagination'
import classes from './Gallery.module.css'

const Gallery = (props) => {

  const [currentPage, setCurrentPage] = useState(1)
  const [imagesPerPage] = useState(24)
  const indexOfLastImage = currentPage * imagesPerPage
  const indexOfFirstImage = indexOfLastImage- imagesPerPage
  const removalsWithImage = props.removals.filter(r => !r.image ? false : true )
  const currentImages = removalsWithImage.slice(indexOfFirstImage, indexOfLastImage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (!props) {
    return null
  }

  const projectCards = () => {
    return currentImages.map(r =>
      <Card  key={r.name} color='orange' header={<Link to={`/removals/${r.id}`} data-cy='link'>{r.name}</Link>}
        meta={<span data-cy='meta'>{`Created ${moment(r.date).format('DD.MM.YYYY')}`}</span>} image={<img src={r.image} data-cy='image'/>} className={classes.card}
        extra={r.removed ? <div><Icon color='green' name='checkmark' /> <span data-cy='removed'>Removed</span></div> : <div><Icon color='red' name='x' /> <span data-cy='notremoved'>Not removed</span></div>}
      />
    )
  }

  return (
    <div>
      <div>
        <Title title={'My gallery'} />
      </div>
      <div className={classes.gallery}>
        <Card.Group>
          {projectCards()}
        </Card.Group>
      </div>
      <Pagination rowsPerPage={imagesPerPage} totalRows={removalsWithImage.length} paginate={paginate} currentPage={currentPage}/>
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