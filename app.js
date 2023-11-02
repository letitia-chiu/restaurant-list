const express = require('express')
const app = express()

const {engine} = require('express-handlebars')

const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.search?.trim().toLowerCase()
  const matchedRestaurants = keyword? restaurants.filter((rst) => 
    Object.values(rst).some((prop) => {
      if (typeof prop === 'string') {
        return prop.toLowerCase().includes(keyword)
      }
      return false
    })
  ) : restaurants
  res.render('index', {restaurants: matchedRestaurants, keyword})
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((rst) => rst.id.toString() === id)
  res.render('detail', {restaurant})
})

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})