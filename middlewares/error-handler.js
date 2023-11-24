const maxRedirects = 5
let redirectCount = 0

module.exports = (error, req, res, next) => {
  
  redirectCount++

  console.log(error)
  req.flash('error', error.errorMessage || '處理失敗:(')

  // 如果錯誤重新導向太多次，則導回登入頁（避免錯誤＆back重新導向循環）
  if (redirectCount > maxRedirects ) res.redirect('/login')

  res.redirect('back')

  next(error)
}