var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var model = require('../models/users');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');

router.get('/', function(req, res){
  res.render('register');
});

router.post('/', function(req, res){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash
  });
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
