var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/users');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var register = require('./register');
var sessions = require('client-sessions');


router.get('/', function(req, res){
  res.render('login');
});

router.post('/', function(req, res){
  // find user in databse, verify password, set session
  //check invites middleware if login successful
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user){
      var error = 'No user found with that email. Head to registration page.';
      res.render('login', { error: error});
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)){
        req.session.user = user; //set-cookie: {firstName:.., lastName:.., email:.., pass:}
        res.redirect('/dashboard');
      } else{
        res.render('login', {error: 'Incorrect password. Try again'});
      }
    }
  });
});



module.exports = router;