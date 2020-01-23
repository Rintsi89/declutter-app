const router = require('express').Router()
const S3 = require('../utils/s3-config')
const UserController = require('../controllers/users')
const { checkAuth } = require('../utils/middleware')

// Create user
router.post('/', UserController.create)

// Confirm user account via link in email
router.get('/confirmation/:token', UserController.confirm)

// Request for link to reset password
router.post('/forgotPassword', UserController.forgotPassword)

// Verify token to change password
router.get('/reset/:token', UserController.verifyPasswordToken )

// Reset password
router.put('/resetPassword', UserController.resetPassword)

// Edit personal details (username, name, email and description)
router.patch('/:id', checkAuth, UserController.edit)

// Edit profile picture
router.put('/:id/picture/add', checkAuth, S3.upload.single('image'), UserController.addPicture)

// Delete profile picture
router.delete('/:id/picture/remove', checkAuth, UserController.deletePicture)

// Add location
router.patch('/:id/locations/add', checkAuth, UserController.addLocation)

// Delete location
router.patch('/:id/locations/remove', checkAuth, UserController.deleteLocation)

// Add sale location
router.patch('/:id/salelocations/add', checkAuth, UserController.addSaleLocation)

// Delete sale location
router.patch('/:id/salelocations/remove', checkAuth, UserController.deleteSaleLocation)

// Add category
router.patch('/:id/categories/add', checkAuth, UserController.addCategory)

// Delete category
router.patch('/:id/categories/remove', checkAuth, UserController.deleteCategory)

// Change password
router.put('/:id/password', checkAuth, UserController.changePassword)

// Set user as inactive = delete
router.put('/:id/delete', checkAuth, UserController.deleteAccount)

module.exports = router