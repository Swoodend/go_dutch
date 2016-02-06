var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var model = require('../models/users');
var User = mongoose.model('User');


router.get('/', function(req, res){
  res.render('register');
});

router.post('/', function(req, res){
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });
  console.log(user);
  user.save(function(err, resp){
    if (err){
      var error = 'Something went wrong. Please try again';
      if (err.code === 11000){
        error = 'That email is already associated with an account. Please try again';
      }
      res.render('register', { error: error });
    } else {
      res.redirect('/dashboard');
    }
  });
});



module.exports = router;