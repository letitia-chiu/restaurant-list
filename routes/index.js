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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName'],
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value
  const name = profile.displayName

  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
    raw: true
  })
    .then((user) => {
      // 確認有無使用者資料
      if (user) return done(null, user)
      
      // 若無使用者資料，則產生隨機密碼並新增
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then((hash) => User.create({ name, email, password: hash }))
        .then((user) => done(null, { id: user.id, name: user.name, email: user.email }))
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
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

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
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