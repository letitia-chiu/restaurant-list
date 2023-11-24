const express = require('express')
const router = express.Router()
const passport = require('passport')

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