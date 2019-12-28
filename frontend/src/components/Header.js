import React from 'react'
import { Icon, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logOutUser } from '../reducers/loginReducer'
import classes from '../styles/Header.module.css'

const Header = (props) => {

    const handleLogOut = () => {

        const user = props.logged_user
        window.localStorage.removeItem(
          'loggedUser', JSON.stringify(user)
        )
        props.logOutUser()
      }

    return(
        <header className={classes.header}>
            <div>
                <h2 className={classes.h2}>Declutter App</h2>
                <Icon name='trash' size='big' />
                <Icon name='dolly' size='big' />
                <Icon name='money bill alternate outline' size='big' />
            </div>
            <div>
                <Link to="/">My removals</Link>
                <Link to="/myaccount">My account</Link>
                <Button negative size='tiny' onClick={() => handleLogOut()}><Link to="/">Log out</Link></Button>
            </div>
        </header>
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

export default ConnectedHeader