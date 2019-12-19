import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeUser } from './reducers/loginReducer'
import removalService from './services/removals'
import Landing from './components/Landing'
import Header from './components/Header'
import Main from './components/Main'

const App = (props) => {

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.initializeUser(user)
      removalService.setToken(user.token)
    }
  }, [])
  
  return (
    <div>
      {!props.logged_user ? 
        <Landing />
      : <div>
          <Header />
          <Main />
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    logged_user: state.logged_user
  }
}

const mapDispatchToProps = {
  initializeUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
