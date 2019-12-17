import React from 'react'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { loginUser } from '../reducers/loginReducer'
import classes from '../styles/Form.module.css'

const Landing = (props) => {
  
  const username = useField('text', 'username')
  const password = useField('password', 'password')

  const handleLogin = async (event) => {
    event.preventDefault()

    const credentials = {
      username: username.attributes.value,
      password: password.attributes.value
    }

    try {
      await props.loginUser(credentials)
    } catch (exception) {
      // props.showMessage('Wrong user name or password', 'error', 5000)
      username.reset()
      password.reset()
    }
  }

  return (
    <div>
        <h2>Welcome to Declutter App</h2>
        <form onSubmit={handleLogin} className={classes.form}>
          <input {...username.attributes}></input>
          <input {...password.attributes}></input>
          <button type='submit'>Log in</button>
        </form>
    </div>
  )
}

const mapDispatchToProps = {
  loginUser
}

const ConnectedLanding= connect(
  null,
  mapDispatchToProps
)(Landing)


export default ConnectedLanding