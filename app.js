const express = require('express')
const app = express()

const {engine} = require('express-handlebars')

const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant
// const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

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
  const restaurant = restaurants.find((rst) => rst.id.toString() === id)
  res.render('detail', {restaurant})
})

app.get('/restaurants/new', (req, res) => {
  res.send('新增餐廳頁面')
})

app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  res.send(`編輯餐廳頁面（ID: ${id})`)
})

app.post('/restaurants', (req, res) => {
  res.send('已新增一筆新的餐廳資料')
})

app.put('/restaurant/:id', (req, res) => {
  res.send(`已編輯餐廳（ID: ${id})`)
})

app.delete('/restaurant/:id', (req, res) => {
  res.send(`已刪除餐廳（ID: ${id})`)
})

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})