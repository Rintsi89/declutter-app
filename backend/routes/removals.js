const router = require('express').Router()
const S3 = require('../utils/s3-config')
const RemovalController = require('../controllers/removals')
// Middleware to check authentication
const { checkAuth } = require('../utils/middleware')

// --- ROUTES ---

// Get all removals
router.get('/', checkAuth, RemovalController.getAll)

// Create removal
router.post('/', checkAuth, S3.upload.single('image'), RemovalController.create)

// Edit removal details
router.patch('/:id', checkAuth, RemovalController.edit)

// Add picture
router.put('/:id/picture/add', checkAuth, S3.upload.single('image'), RemovalController.addPicture)

// Delete picture
router.delete('/:id/picture/remove', checkAuth, RemovalController.deletePicture)

// Delete removal
router.delete('/:id', checkAuth, RemovalController.deleteRemoval)

module.exports = router