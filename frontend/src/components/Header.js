import React from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
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
        <header>
            <div className={classes.header}>
                <div>
                    <h2>Declutter App</h2>
                    <Icon name='trash' size='big' />
                    <Icon name='dolly' size='big' />
                    <Icon name='money bill alternate outline' size='big' />
                </div>
                <div>
                    {props.logged_user.username}
                    <button onClick={() => handleLogOut()}>Log out</button>
                </div>
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