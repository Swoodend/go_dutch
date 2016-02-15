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
    user.room.roomies.push({
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: currentUserEmail
      });
    user.room.roomName = roomName;
    req.session.user.room.roomName = roomName;
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

router.post('/acceptinvite', function(req, res){
  var acceptInvite = req.body.inviteStatusAccept;
  if (acceptInvite){
    //find tudor by session data
    //update his 'roomies' data to include: 
      //name of roomate(person who sent request)
      //email of roomate
      //name of room
    User.findOne({email: req.session.user.email}, function(err, user){
      user.room.roomies.push({
        firstName: user.roomInvites[0].firstName,
        lastName: user.roomInvites[0].lastName,
        email: user.roomInvites[0].email,
        roomName: user.roomInvites[0].roomName
      });
    User.findOne({email: user.roomInvites[0].email}, function(err, user2){
      user2.room.roomies.push({
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        email: req.session.user.email,
        roomName: req.session.user.room.roomName
      });
      user2.save();
    });
      user.roomInvites.pop();
      user.save(function(err, resp){
        if (err){
          res.send('something went wrong');
        } else {
          //render dashboard
          res.redirect('/dashboard');
        }
      })
    });
  } else {
    res.send('you declined the invite');
  }
});

router.post('/addroommate', function(req, res){
  User.findOne({email: req.body.roomMateEmail}, function(err, user){
    //have to create a room before you can invite ppl
    //if the invitee is found and the current user has a room
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