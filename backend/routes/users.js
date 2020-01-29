const router = require('express').Router()
const S3 = require('../utils/s3-config')
const UserController = require('../controllers/users')
const { checkAuth } = require('../utils/middleware')

// Create user -- tested
router.post('/', UserController.create)

// Confirm user account via link in email -- tested
router.get('/confirmation/:token', UserController.confirm)

// Request for link to reset password -- tested
router.post('/forgotPassword', UserController.forgotPassword)

// Verify token to change password -- tested
router.get('/reset/:token', UserController.verifyPasswordToken )

// Reset password -- tested
router.patch('/resetPassword', UserController.resetPassword)

// These routes require authentication:

// Edit personal details (username, name, email and description) -- tested
router.patch('/:id', checkAuth, UserController.edit)

// Edit profile picture -- tested SOME ISSUES REMAIN!!
router.patch('/:id/picture/add', checkAuth, S3.upload.single('image'), UserController.addPicture)

// Delete profile picture -- tested
router.patch('/:id/picture/remove', checkAuth, UserController.deletePicture)

// Add location -- tested
router.patch('/:id/locations/add', checkAuth, UserController.addLocation)

// Delete location -- tested
router.patch('/:id/locations/remove', checkAuth, UserController.deleteLocation)

// Add sale location -- tested
router.patch('/:id/salelocations/add', checkAuth, UserController.addSaleLocation)

// Delete sale location -- tested
router.patch('/:id/salelocations/remove', checkAuth, UserController.deleteSaleLocation)

// Add category -- tested
router.patch('/:id/categories/add', checkAuth, UserController.addCategory)

// Delete category -- tested
router.patch('/:id/categories/remove', checkAuth, UserController.deleteCategory)

// Change password -- tested
router.patch('/:id/password', checkAuth, UserController.changePassword)

// Set user as inactive = delete -- tested
router.patch('/:id/delete', checkAuth, UserController.deleteAccount)

module.exports = router