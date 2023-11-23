module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next()

  // 若登入驗證未通過，重新導向至登入頁
  req.flash('error', '登入失敗！')
  return res.redirect('/login')
}