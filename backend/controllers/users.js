const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (request, response, next) => {
    try {
        const users = await User.find({})
        response.json(users)
    } catch (error) {
        next()
    }
})

router.post('/', async (request, response, next) => {
    try {
        const { username, password, name } = request.body

        if (!password || password.length < 3) {
            return response.status(400).send({
                error: 'password minimum length is 3'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()
        
        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        const passwordCorrect = user === null ? false : await bcrypt.compare(request.body.password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            return response.status(401).json({
                error: 'Invalid token or password'
            })
        }
        await User.findByIdAndDelete(user.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = router