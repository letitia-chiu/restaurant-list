const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const limit = 10 // Items per page

router.get('/', async (req, res) => {
  try {
    // 從database取得餐廳資料
    const restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'rating', 'description'],
      raw: true
    })

    // 若關鍵字存在則進行篩選，若無關鍵字則回傳所有資料
    const keyword = req.query.search?.trim().toLowerCase()
    const matchedRestaurants = keyword? restaurants.filter((rst) => 
      Object.values(rst).some((prop) => {
        if (typeof prop === 'string') {
          return prop.toLowerCase().includes(keyword)
        }
        return false
      })
    ) : restaurants

    // 渲染畫面
    res.render('index', {restaurants: matchedRestaurants, keyword})
  
  // 錯誤處理
  } catch (err) {
    console.log(err)
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

router.post('/', (req, res) => {
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
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

router.put('/:id', (req, res) => {
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
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((err) => console.log(err))
  
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: {id} })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

module.exports = router