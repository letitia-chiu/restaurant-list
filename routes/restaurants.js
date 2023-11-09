const express = require('express')
const router = express.Router()

const restaurantHandler = require('../middlewares/restaurant-handler')

router.get('/', restaurantHandler.getAll, async (req, res, next) => {
  try {
    // 取得 getRestaurant 回傳參數
    const { filteredRestaurants, keyword, sortOption, currentPage, maxPage} = req
    
    // 渲染畫面
    res.render('index', {
      restaurants: filteredRestaurants,
      keyword,
      sort: sortOption, 
      noResult: filteredRestaurants.length === 0,
      page: currentPage,
      maxPage,
      prev: currentPage > 1 ? currentPage - 1 : 1,
      next: currentPage < maxPage ? currentPage + 1 : maxPage  
    })

  } catch (error) {
    next(error)
  }
})

router.get('/new', (req, res, next) => {
  try {
    res.render('new')
  } catch (error) {
    next(error)
  }  
})

router.get('/:id', restaurantHandler.getById, (req, res, next) => {
  try {
    const { restaurant} = req
    res.render('detail', { restaurant })
  } catch (error) {
    next(error)
  }
})

router.get('/:id/edit', restaurantHandler.getEdit, (req, res, next) => {
  try {
    const { restaurant } = req
    res.render('edit', { restaurant })
  } catch (error) {
    next(error)
  }
})

router.post('/', restaurantHandler.create)

router.put('/:id', restaurantHandler.update)

router.delete('/:id', restaurantHandler.delete)

module.exports = router