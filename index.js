const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// MODELS:
const User = require('./models/User')


// TEMPLATE ENGINE:
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


// MIDDLEWARES
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.use(express.static('public'))

app.use(
  session({
    name: 'session',
    secret: 'secretly_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: () => {},
      path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true
    }
  })
)

app.use(flash())

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session
  }

  next()
})



// CONNECTION TO THE DATABASE
conn
  .sync()
  .then(() => {
    app.listen(3000)
  })
  .catch(err => console.error(`An error occurred: ${err}`))
