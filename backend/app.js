const express = require('express');
const session = require("express-session");
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const admin = require('firebase-admin');
const serviceAccount = require("./resources/firebase.json");
const cert = require("./resources/cert.json");

const indexRouter = require('./routes/index');

const app = express();

/**
 * Session
 */
app.use(session({
    secret: cert.secret,
    resave: true,
    saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true, limit: '100MB' }));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../../uploads')));

/**
 * Connect database
 */
const db = mongoose.connect('mongodb://mongodb:27017/arxiview', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

db.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
});

/**
 * Initialize firebase admin
 */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://arxiview.firebaseio.com"
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    return next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.locals.title = "ArXiView";

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
