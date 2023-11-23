const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user || user.password !== password) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }
      done(null, user)
    })
    .catch((error) => done(error))
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

const restaurants = require('./restaurants')
const users = require('./users')


router.use('/restaurants', restaurants)
router.use('/users', users)

router.get('/', (req, res) => {
  res.redirect('/login')
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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/logout', (req, res ,next) => {
  res.send('You have logout!')
})

module.exports = router