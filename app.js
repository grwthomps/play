const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());      // extended: utf8 and emojis etc
app.use(bodyParser.urlencoded({ extended: true}));
app.set('port', process.env.PORT || 3000);

const indexRouter = require('./routes/index');
const favoritesRouter = require('./routes/api/v1/favorites');

app.locals.title = 'Play Play';



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/favorites', favoritesRouter);



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
