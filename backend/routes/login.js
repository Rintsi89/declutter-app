
const router = require('express').Router()
const LoginController = require('../controllers/login')

// Log in
router.post('/', LoginController.login)

module.exports = router