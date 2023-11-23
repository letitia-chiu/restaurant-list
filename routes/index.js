const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.get('/register', (req, res, next) => {
  res.render('register')
})

router.post('/users', (req, res, next) => {
  const user = req.body
  res.send(user)
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  const user = req.body
  res.send(user)
})

router.post('/logout', (req, res ,next) => {
  res.send('You have logout!')
})

module.exports = router