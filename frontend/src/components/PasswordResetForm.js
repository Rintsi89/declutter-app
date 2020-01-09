import React from 'react'
import classes from '../styles/Form.module.css'

const PasswordResetForm = (props) => {

    if (!props.user) {
        return <h3>You dont have access to be here!</h3>
    }


return (
    <div>
        <h2>Password reset form!</h2>
    </div>
    )
}

  export default PasswordResetForm