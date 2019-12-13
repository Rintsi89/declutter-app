const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Removal = require('../models/removal')
const User = require('../models/user')

router.get('/', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const removals = await Removal.find({ user: { $in: [decodedToken.id] }})
        response.json(removals)
        
    } catch (error) {
        next(error)
    }
})

router.post('/', async (request, response, next) => {
    try {
        const removal = new Removal(request.body)
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        
        const user = await User.findById(decodedToken.id)

        removal.user = user._id
        await removal.save()

        user.removals = user.removals.concat(removal._id)
        await user.save()

        const addedRemovalWithUser = await Removal.findById(removal._id).populate('user')
        response.status(201).json(addedRemovalWithUser)

    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        await Removal.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = router