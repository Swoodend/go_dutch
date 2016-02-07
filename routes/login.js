var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/users');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var register = require('./register');

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
      console.log(user.password)
      if (bcrypt.compareSync(req.body.password, user.password)){
        res.redirect('dashboard');
      } else{
        console.log(user.password)
        res.render('login', {error: 'Incorrect password. Try again'});
      }
    }
  });
});



module.exports = router;