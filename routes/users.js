const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

router.post('/', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body

  // 驗證是否有輸入 email 與 password
  if (!email || !password) {
    req.flash('error', 'E-mail 與密碼為必填')
    return res.redirect('back')
  }

  // 驗證 confirmPassword 是否與 password 一致
  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    return res.redirect('back')
  }

  // 驗證 email 是否已註冊過
  return User.count({ where: { email }})
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash('error', '此 E-mail 已註冊過')
        return
      }

      // 若未註冊過，則加密密碼後新增 user 資料
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash }))
    })
    .then((user) => {
      if (!user) return res.redirect('back')

      req.flash('success', '註冊成功！')
      return res.redirect('login')
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗！'
      next(error)
    })
})

module.exports = router