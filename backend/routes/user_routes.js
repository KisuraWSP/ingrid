const user_controllers = require('../controllers/user_controller')
const express = require('express')
const router = express.Router()

router.post('/register', user_controllers.createUserController)
router.post('/login', user_controllers.loginController)

module.exports = router