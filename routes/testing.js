const router = require('express').Router()
const TestingController = require('../controllers/testing')
const { checkAuth } = require('../utils/middleware')

router.post('/reset', TestingController.reset)

router.post('/initUser', TestingController.initUser)

router.post('/initSecondUser', TestingController.initSecondUser)

router.post('/initRemovals', checkAuth, TestingController.initRemovals)

module.exports = router