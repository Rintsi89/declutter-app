import React from 'react'
import { withRouter } from "react-router"
import classes from '../styles/NoAccessPage.module.css'

const NoAccessPage = (props) => {

    return (
        <div className={classes.main}>
            <h1 className={classes.title}>Access Denied!</h1>
            <p className={classes.linkhome}>Go to <button className={classes.buttonlink} onClick={() => props.history.push('/login')}>the main page</button>to log in</p>
            <p className={classes.minifooter}>Declutter App 2020</p>  
        </div>
    )
}

export default withRouter(NoAccessPage)