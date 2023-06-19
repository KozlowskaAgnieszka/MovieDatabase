const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./util/database');
const loginRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const errorRoutes = require('./routes/error');

const app = express();
const store = new MySQLStore({ schema: { tableName: 'sessions' } }, db);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'session_cookie_secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use(loginRoutes);
app.use(movieRoutes);
app.use(errorRoutes);

app.listen(4000, () => {
  console.log(`http://127.0.0.1:4000`);
});
