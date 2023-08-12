const { Router } = require('express')
const authController = require('../controllers/authController')
const router = Router()

// GET-Signup page
router.get('/signup', authController.signup_get)

// POST-Signup page
router.post('/signup', authController.signup_post)

// GET-Login page
router.get('/login', authController.login_get)

// POST-Login page
router.post('/login', authController.login_post)

// GET-Logout page
router.get('/logout', authController.logout_get)

module.exports = router