import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Title from './Title'
import Pagination from './Pagination'
import classes from '../styles/Gallery.module.css'

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
                <Card key={r.name} color='green' header={r.name} meta={r.date} image={r.image} className={classes.card} />
          )
      }

    //   {<Link to={`/removals/${r.id}`}>{r.name}</Link>}

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
            <Pagination rowsPerPage={imagesPerPage} totalRows={removalsWithImage.length} paginate={paginate}/>
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