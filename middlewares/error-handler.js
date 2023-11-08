module.exports = (error, req, res, next) => {
  console.log(error)
  req.flash('error', error.errorMessage || '處理失敗:(')
  res.redirect('back')

  next(error)
}