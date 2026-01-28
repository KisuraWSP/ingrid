const user_controllers = require('../controllers/user_controller')
const express = require('express')
const router = express.Router()

// Public Routes
router.post('/register', user_controllers.createUserController)
router.post('/login', user_controllers.loginController)

// Admin Routes
router.get('/admin', user_controllers.getAllUsersController)
router.get('/admin/:id', user_controllers.getUserByIdController)
router.put('/admin/:id', user_controllers.updateUserByIdController)
router.delete('/admin/:id', user_controllers.deleteUserByIdController)

module.exports = router