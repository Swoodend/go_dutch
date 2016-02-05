var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var title = 'GO Dutch'

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middlewares


//routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  // create a user in DB with form data
  res.redirect('dashboard');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  // find user in databse, verify password, set session
  //check invites middleware if login successful
  res.redirect('dashboard');
});

app.get('/dashboard', function(req, res){
  res.render('dashboard');
});

app.get('/createroom', function(req, res){
  res.render('createroom');
});

app.post('/createroom', function(req, res){
  //create a room associated with the user in the DB
  //the room should have the given name from the form
  // the room-users(ie ppl living in room) should have the only the user who created it
  //
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
