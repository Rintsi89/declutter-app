import React from 'react'
import { withRouter } from 'react-router'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logOutUser } from '../../reducers/userReducer'
import SearchBar from './Search/SearchBar'
import classes from './Header.module.css'

const Header = (props) => {

  const handleLogOut = () => {
    props.logOutUser()
    props.history.push('/login')
  }

  return(
    <div>
      <div className={classes.header}>
        <div>
          <h2 className={classes.h2} data-cy='maintitle'>Declutter App</h2>
          <Icon name='trash' size='big' />
          <Icon name='dolly' size='big' />
          <Icon name='money bill alternate outline' size='big' />
          <div className={classes.signature} data-cy='signature' >By Ville Rintala</div>
        </div>
        <div>
          <SearchBar />
        </div>
        <div className={classes.navitems}>
          <Link to="/removals" data-cy='removals'> | removals</Link>
          <Link to="/myaccount" data-cy='account'>| account</Link>
          <Link to="/gallery" data-cy='gallery'> | gallery</Link>
          <Link to="#"><button onClick={() => handleLogOut()} className={classes.buttonlink} data-cy='logout'><Icon name='sign-out' size='small' /> log out</button></Link>
        </div>
      </div>

      {/* This add extra spacer after fixed header so elements underneath it can refer their margins to this */}
      <div className={classes.spacer}>
              &nbsp;
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