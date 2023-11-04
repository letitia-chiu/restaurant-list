const express = require('express')
const app = express()
const methodOverride = require('method-override')
const handlebars = require('handlebars')

const { engine } = require('express-handlebars')

const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

handlebars.registerHelper('eq', (arg1, arg2) => {
  return arg1 === arg2
})

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', async (req, res) => {
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

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('detail', { restaurant }))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => res.render('edit', { id, restaurant}))
    .catch((err) => console.log(err))
})

app.post('/restaurants', (req, res) => {
  const add = req.body
  return Restaurant.create({
    name: add.name,
    name_en: add.name_en || null,
    category: add.category,
    image: add.image,
    location: add.location,
    phone: add.phone,
    google_map: add.google_map,
    rating: add.rating,
    description: add.description || null
  })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

app.put('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const edit = req.body
  return Restaurant.update({
    name: edit.name,
    name_en: edit.name_en || null,
    category: edit.category,
    image: edit.image,
    location: edit.location,
    phone: edit.phone,
    google_map: edit.google_map,
    rating: edit.rating,
    description: edit.description || null
  }, { where: {id} })
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch((err) => console.log(err))
  
})

app.delete('/restaurant/:id', (req, res) => {
  const id = req.params.id
  res.send(`已刪除餐廳（ID: ${id})`)
})

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})