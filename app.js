var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {google} = require('googleapis');
const cors = require('cors');
require('dotenv').config();


global.yt = google.youtube({
    version: 'v3',
    auth: 'AIzaSyDR49p1SGcGayJbWVMnl3kERtrrg0dkCCs'
  });


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors({
    origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
