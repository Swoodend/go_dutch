var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/users');
var User = mongoose.model('User');

router.get('/', function(req, res){
  res.render('createroom');
});

router.post('/', function(req, res){
  var currentUserEmail = req.session.user.email;
  var roomName = req.body.name;
  var currentuser = User.findOne({email: currentUserEmail}, function(err, user){
    user.room.roomName = roomName;
    user.room.roomies.push({
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: currentUserEmail
      });
    user.save(function(err, resp){
      if (err){
        var error = 'something went wrong. try again';
        res.render('/createroom', {error: error});
      } else{
        res.redirect('/dashboard');
      }
    });
  });
});

module.exports = router;