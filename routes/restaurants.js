const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const limit = 9 // Items per page

router.get('/', async (req, res, next) => {
  try {
    // 取得排序條件
    const sort = req.query.sort
    let condition = []
    switch (sort) {
      case 'ASC':
      case 'DESC':
        condition = [['name', sort]]
        break;
      case 'category':
      case 'location':
        condition = [[ sort ]]
        break;
      case 'rating_DESC':
        condition = [['rating', 'DESC']]
        break;
      case 'rating_ASC':
        condition = [['rating', 'ASC']]
        break;
    }

    // 從database取得餐廳資料
    const restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'rating', 'description'],
      order: condition,
      raw: true
    })

    // 若關鍵字存在則進行篩選，若無關鍵字則回傳所有資料
    const keyword = req.query.search?.trim().toLowerCase()
    let matchedRestaurants = []

    if (keyword) {
      matchedRestaurants = restaurants.filter((rst) => 
        Object.values(rst).some((prop) => {
          if (typeof prop === 'string') {
            return prop.toLowerCase().includes(keyword)
          }
          return false
        })
      )
    } else {
      matchedRestaurants = restaurants
    } 
    
    // 渲染畫面
    res.render('index', {restaurants: matchedRestaurants, keyword, sort, 
      noResult: matchedRestaurants.length === 0    
    })
  
  // 錯誤處理
  } catch (error) {
    next(error)
  }
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('detail', { restaurant }))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => res.render('edit', { id, restaurant}))
    .catch((err) => console.log(err))
})

router.post('/', (req, res, next) => {
  const add = req.body
  return Restaurant.create({
    name: add.name,
    name_en: add.name_en || null,
    category: add.category,
    image: add.image || null,
    location: add.location,
    phone: add.phone,
    google_map: add.google_map || null,
    rating: add.rating,
    description: add.description || null
  })
    .then(() => {
      req.flash('success', '新增成功！')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      if (error.original.code === 'ER_DATA_TOO_LONG') {
      error.errorMessage = '更新失敗（輸入內容太長）'
      }
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  const edit = req.body
  return Restaurant.update({
    name: edit.name,
    name_en: edit.name_en || null,
    category: edit.category,
    image: edit.image || null,
    location: edit.location,
    phone: edit.phone,
    google_map: edit.google_map || null,
    rating: edit.rating,
    description: edit.description || null
  }, { where: {id} })
    .then(() => {
      req.flash('success', '更新成功！')
      res.redirect(`/restaurants/${id}`)
  })
    .catch((error) => {
      if (error.original.code === 'ER_DATA_TOO_LONG') {
      error.errorMessage = '更新失敗（輸入內容太長）'
      }
      next(error)
    })
  
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: {id} })
    .then(() => {
      req.flash('success', '刪除成功！')
      res.redirect('/restaurants')
  })
    .catch((err) => console.log(err))
})

module.exports = router