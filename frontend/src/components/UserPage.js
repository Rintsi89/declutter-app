import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Image, Item, Icon } from 'semantic-ui-react'
import { setTitle } from '../reducers/titleReducer'
import PasswordForm from './PasswordForm'
import EditForm from './EditForm'
import classes from '../styles/User.module.css'

const UserPage = (props) => {

    useEffect(() => {
        props.setTitle('My account')
    }, [])

    const [form, setForm] = useState(null)

    return (
        <div>
            <h2 className={classes.maintitle}>{props.title}</h2>
            <div className={classes.infoarea}>
                <Item.Group>
                    <Item>
                    <Item.Image size='small' src={props.logged_user.image} />
                    <Item.Content className={classes.content}>
                        <Item.Header as='a'>{props.logged_user.username}</Item.Header>
                        <Item.Meta>{props.logged_user.description}</Item.Meta>
                        <Item.Description>Name: {props.logged_user.name}</Item.Description>
                        <Item.Description>Locations: {props.logged_user.locations.join(", ")}</Item.Description>
                        <Item.Extra>You have currently {props.removals.length} removals</Item.Extra>
                    </Item.Content>
                    <Item.Content>
                        <Item.Header as='a'>Actions</Item.Header>
                        <Item.Meta>What you would like to do with your account?</Item.Meta>
                        <Item.Description><Icon name='edit' /><button onClick={() => setForm('editform')}>Edit personal details</button></Item.Description>
                        <Item.Description><Icon name='user secret' /><button onClick={() => setForm('passwordform')}>Change password</button></Item.Description>
                        <Item.Description><Icon name='trash alternate outline' /><button>Delete account</button></Item.Description>
                    </Item.Content>
                    </Item>
                </Item.Group>
            </div>
            {(form && form === 'passwordform') ?
            <PasswordForm /> :
            <EditForm />
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      logged_user: state.logged_user,
      removals: state.removals,
      title: state.title
    }
  }

const mapDispatchToProps = {
    setTitle
}

const ConnectedUserPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPage)

export default ConnectedUserPage