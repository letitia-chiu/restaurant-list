const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }

      return bcrypt.compare(password, user.password)
       .then((isMatch) => {
        if (!isMatch) return done(null, false, { message: 'email 或密碼錯誤' })

        return done(null, user)
       })
    })
    .catch((error) => done(error))
}))



passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id, name: user.name })
})

const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)

router.get('/', authHandler, (req, res) => {
  res.redirect('/restaurants')
})

router.get('/register', (req, res, next) => {
  res.render('register')
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
  req.logout((error) => {
    if (error) next(error)

    req.flash('success', '已登出，歡迎重新登入')
    return res.redirect('/login')
  })
})

module.exports = router