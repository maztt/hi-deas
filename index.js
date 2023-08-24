import { IdeaController } from './controllers/IdeaController.js'
import ideasRoutes from './routes/ideasRoutes.js'
import authRoutes from './routes/authRoutes.js'
import express from 'express'
import exphbs from 'express-handlebars'
import conn from './db/conn.js'
import { configureMiddlewares } from './middlewares/configure-middlewares.js'

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
configureMiddlewares(app)

app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.session = req.session
    }
    next()
})

app.use('/', authRoutes)
app.use('/ideas', ideasRoutes)
app.get('/', IdeaController.list)


conn.sync()
    .then(() => {
        app.listen(3000)
    })
    .catch(err => console.error(`An error occurred: ${err}`))
