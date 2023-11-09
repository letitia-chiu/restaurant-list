const db = require('../models')
const Restaurant = db.Restaurant

const Op = require('sequelize').Op

const limit = 6 // Items per page

const restaurantHandler = {}

restaurantHandler.getAll = async (req, res, next) => {
  try {
    // 取得排序條件
    const sortOption = req.query.sort
    let sortCondition = []
    switch (sortOption) {
      case 'ASC':
      case 'DESC':
        sortCondition = [['name', sortOption]]
        break;
      case 'category':
      case 'location':
        sortCondition = [[ sortOption ]]
        break;
      case 'rating_DESC':
        sortCondition = [['rating', 'DESC']]
        break;
      case 'rating_ASC':
        sortCondition = [['rating', 'ASC']]
        break;
    }

    // 取得目前頁數
    const currentPage = parseInt(req.query.page) || 1

    // 設定搜尋條件
    const keyword = req.query.search?.trim().toLowerCase();
    const searchCondition = keyword ? {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { name_en: { [Op.like]: `%${keyword}%` } },
        { category: { [Op.like]: `%${keyword}%` } },
        { location: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    } : {}

    // 從資料庫取得餐廳資料
    const filteredRestaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'rating', 'description'],
      where: searchCondition,
      order: sortCondition,
      offset: (currentPage - 1) * limit,
      limit,
      raw: true
    })

    // 計算最大頁數
    let restaurantCount = ''
    if (keyword) {
      restaurantCount = await Restaurant.count({
        where: searchCondition
      })
    } else {
      restaurantCount = await Restaurant.count()
    }
    const maxPage = Math.ceil(restaurantCount / limit)

    // 若指定頁數超過最大頁數則重新導向
    if (currentPage > maxPage) {
      return res.redirect(`/restaurants?search=${keyword}&sort=${sortOption}&page=${maxPage}`)
    }

    // 以 req 回傳參數至路由
    req.filteredRestaurants = filteredRestaurants
    req.keyword = keyword
    req.sortOption = sortOption
    req.currentPage = currentPage
    req.maxPage = maxPage

    next()

  } catch (error) {
    next(error)
  }
}

restaurantHandler.getById = async (req, res, next) => {
  try {
    const id = req.params.id
    req.restaurant = await Restaurant.findByPk(id, {
      attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
      raw: true
    })

    next()

  } catch (error) {
    next(error)
  }
}

restaurantHandler.getEdit = async (req, res, next) => {
  try {
    const id = req.params.id
    req.restaurant = await Restaurant.findByPk(id, {
      raw: true
    })

    next()

  } catch (error) {
    next(error)
  }
}

restaurantHandler.create = async (req, res, next) => {
  try {
    const add = req.body

    await Restaurant.create({
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

    req.flash('success', '新增成功！')
    res.redirect('/restaurants')

  } catch (error) {
    if (error.original.code === 'ER_DATA_TOO_LONG') {
      error.errorMessage = '更新失敗（輸入內容太長）'
    }
    next(error)
  }
}

restaurantHandler.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const edit = req.body

    await Restaurant.update({
      name: edit.name,
      name_en: edit.name_en || null,
      category: edit.category,
      image: edit.image || null,
      location: edit.location,
      phone: edit.phone,
      google_map: edit.google_map || null,
      rating: edit.rating,
      description: edit.description || null
    }, { where: { id } })

    req.flash('success', '更新成功！')
    res.redirect(`/restaurants/${id}`)

  } catch (error) {
    if (error.original.code === 'ER_DATA_TOO_LONG') {
      error.errorMessage = '更新失敗（輸入內容太長）'
    }
    next(error)
  }
}

restaurantHandler.delete = async (req, res, next) => {
  try {
    const id = req.params.id

    await Restaurant.destroy({ where: {id} })

    req.flash('success', '刪除成功！')
    res.redirect('/restaurants')

  } catch (error) {
    next(error)
  }
}

module.exports = restaurantHandler