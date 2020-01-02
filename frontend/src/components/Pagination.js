import React from 'react'
import classes from '../styles/Pagination.module.css'

const Pagination = ({ rowsPerPage, totalRows, paginate }) => {
    const pageNumbers = []
    
    for(let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
        pageNumbers.push(i)
    }
    
    return (
        <div className={classes.pagination}>
            {pageNumbers.map(number => (
                <a key={number} onClick={() => paginate(number)}>
                    {number}
                </a>
            ))}
        </div>
    )
}

export default Pagination