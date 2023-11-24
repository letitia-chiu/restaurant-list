module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user_name = req.user.name || `會員(${req.user.id})`
    return next()
  }

  // 若登入驗證未通過，重新導向至登入頁
  req.flash('error', '尚未登入！')
  return res.redirect('/login')
}