import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import FileStore from 'session-file-store';
import flash from 'express-flash';
import path from 'path';
import os from 'os';
import conn from './db/conn.js'
import { IdeaController } from './controllers/IdeaController.js';

const app = express();


// IMPORTED ROUTES
import ideasRoutes from './routes/ideasRoutes.js';
import authRoutes from './routes/authRoutes.js';


// TEMPLATE ENGINE:
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// MIDDLEWARES
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static('public'));

app.use(
  session({
    name: 'session',
    secret: 'secretly_secret',
    resave: false,
    saveUninitialized: false,
    store: new (FileStore(session))({
      logFn: () => {},
      path: path.join(os.tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }
  next();
});

// ROUTES
app.use('/ideas', ideasRoutes);
app.use('/', authRoutes);

app.get('/', IdeaController.showAll);

// CONNECTION TO THE DATABASE
conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch(err => console.error(`An error occurred: ${err}`));
