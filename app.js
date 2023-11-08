const express = require('express')
const app = express()

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const handlebars = require('handlebars')

const router = require('./routes')

const port = 3000

handlebars.registerHelper('eq', (arg1, arg2) => {
  return arg1 === arg2
})

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(router)


app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})