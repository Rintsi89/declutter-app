import React from 'react'
import { withRouter } from "react-router"
import { Icon, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logOutUser } from '../reducers/userReducer'
import SearchBar from './Search/SearchBar'
import classes from '../styles/Header.module.css'

const Header = (props) => {

    const handleLogOut = () => {

        const user = props.logged_user
        window.localStorage.removeItem(
          'loggedUser', JSON.stringify(user)
        )
        props.logOutUser()
        props.history.push('/login')
      }

    return(
        <div>
              <div className={classes.header}>
                <div>
                  <h2 className={classes.h2}>Declutter App</h2>
                  <Icon name='trash' size='big' />
                  <Icon name='dolly' size='big' />
                  <Icon name='money bill alternate outline' size='big' />
                  <div className={classes.signature}>By Ville Rintala</div>
              </div>
              <div>
                <SearchBar />
              </div>
              <div className={classes.navitems}>
                  <Link to="/"> | removals</Link>
                  <Link to="/myaccount">| account</Link>
                  <Link to="/gallery"> | gallery</Link>
                  <Link to="/"><button onClick={() => handleLogOut()} className={classes.buttonlink}><Icon name='sign-out' size='small' /> log out</button></Link>
              </div>
              </div>
      </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user
    }
  }

const mapDispatchToProps = {
    logOutUser
}

const ConnectedHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

export default withRouter(ConnectedHeader)