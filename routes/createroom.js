var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/users');
var User = mongoose.model('User');

router.get('/', function(req, res){
  res.render('createroom', {user: req.user});
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

router.post('/addroommate', function(req, res){
  User.findOne({email: req.body.roomMateEmail}, function(err, user){
    //have to create a room before you can invite ppl
    if (user && req.session.user.room.roomName){
      user.roomInvites.push({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      });
      user.save(function(err, resp){
        if (!err){
          //redirect to a page here eventually
          res.send(user.firstName + ' has been sent a room invite');
        } else {
          res.send('something went wrong');
        }
      })
    } else{
      res.send('You havent created a room yet or we can\'t find an account associated with that email');
    }
  })
})

module.exports = router;