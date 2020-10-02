const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    rolling: true,
    saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Create the .tpl to allow templating
 */
app.use(function (req, res, next) {
    res.tpl = {};

    if (req.session.documents === undefined) {
        req.session.documents = {};
    }

    return next();
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