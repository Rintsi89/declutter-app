const router = require('express').Router()
const S3 = require('../utils/s3-config')
const RemovalController = require('../controllers/removals')
// Middleware to check authentication
const { checkAuth } = require('../utils/middleware')

// --- ROUTES ---

// These routes require authentication:

// Get all removals -- tested
router.get('/', checkAuth, RemovalController.getAll)

// Create removal -- tested
router.post('/', checkAuth, S3.upload.single('image'), RemovalController.create)

// Edit removal details -- tested
router.patch('/:id', checkAuth, RemovalController.edit)

// Add picture -- tested
router.patch('/:id/picture/add', checkAuth, S3.upload.single('image'), RemovalController.addPicture)

// Delete picture -- tested
router.patch('/:id/picture/remove', checkAuth, RemovalController.deletePicture)

// Delete removal -- tested
router.delete('/:id', checkAuth, RemovalController.deleteRemoval)

module.exports = router