require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const { flash } = require('express-flash-message')
const session = require('express-session')
const methodOverride =require('method-override')
const connectDB = require('./server/config/db')

const app = express()
const port = 1515 || process.env.PORT

// db
connectDB()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))

// static files
app.use(express.static('public'))

// express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1week
    }
  })
)

// flash message
app.use(flash({sessionKeyName: 'flashmessage'}))

// tempalte engine
app.use(expressLayout)
app.set('layout', "./layouts/main")
app.set('view engine', 'ejs')



// routes
app.use('/', require('./server/routes/customer'))


// home




// setup server
app.listen(port, () =>{
  console.log(`server on at ${port}`);
})
