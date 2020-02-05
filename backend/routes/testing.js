const router = require('express').Router()
const TestingController = require('../controllers/testing')

router.post('/reset', TestingController.reset)

router.post('/initUser', TestingController.initUser)

router.post('/initSecondUser', TestingController.initSecondUser)

module.exports = router