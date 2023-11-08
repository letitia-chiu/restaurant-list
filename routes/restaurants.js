const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const Op = require('sequelize').Op

const limit = 6 // Items per page

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

    // 取得目前頁數
    const page = parseInt(req.query.page) || 1

    // 設定搜尋條件
    const keyword = req.query.search?.trim().toLowerCase();
    const whereCondition = keyword ? {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { name_en: { [Op.like]: `%${keyword}%` } },
        { category: { [Op.like]: `%${keyword}%` } },
        { location: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    } : {}

    // 從資料庫取得餐廳資料
    const restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'rating', 'description'],
      where: whereCondition,
      order: condition,
      offset: (page - 1) * limit,
      limit,
      raw: true
    })
    
    // 計算最大頁數
    let count = ''
    if (keyword) {
      count = await Restaurant.count({
        where: whereCondition
      })
    } else {
      count = await Restaurant.count()
    }
    maxPage = Math.ceil(count / limit)
    
    // 若指定頁數超過最大頁數則重新導向
    if (page > maxPage) {
      res.redirect(`/restaurants?search=${keyword}&sort=${sort}&page=${maxPage}`)
    }

    // 渲染畫面
    res.render('index', {restaurants, keyword, sort, 
      noResult: restaurants.length === 0,
      page, maxPage,
      prev: page > 1 ? page - 1 : 1,
      next: page < maxPage ? page + 1 : maxPage  
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