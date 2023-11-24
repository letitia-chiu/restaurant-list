const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const register = require('./register')
const login_logout = require('./login-logout')
const authHandler = require('../middlewares/auth-handler')

router.use('/restaurants', authHandler, restaurants)
router.use('/register', register)
router.use('/', login_logout)

router.get('/', authHandler, (req, res) => {
  res.redirect('/restaurants')
})


module.exports = router