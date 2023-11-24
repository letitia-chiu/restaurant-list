const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

// Set environment variable
console.log('NODE_ENV:', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const handlebars = require('handlebars')

const router = require('./routes')
const passport = require('./config/passport')

const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

const port = 3000

handlebars.registerHelper('eq', (arg1, arg2) => {
  return arg1 === arg2
})
handlebars.registerHelper('or', (arg1, arg2) => {
  return arg1 || arg2
})
handlebars.registerHelper('not', (arg) => {
  return !arg
})

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})