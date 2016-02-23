var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/users');
var User = mongoose.model('User');

function gatherBills(req, res, next){
  var roomName = req.session.user.roomInvites[0].roomName;
  var email = req.session.user.email;

  User.find({roomName: roomName}, function(err, allUsers){
    User.findOne({email: email}, function(err, user){
      for (var i = 0; i < allUsers.length; i++){
        for(var j = 0; j < allUsers[i].bills.length; j++){
          user.bills.push(allUsers[i].bills[j]);
        }
      }
      user.save(function(err){
        if (err){
          res.send(err);
        } else{
          next();
        }
      });
    });
  });
};

router.get('/', function(req, res){
  res.render('createroom');
});

router.post('/', function(req, res){
  var currentUserEmail = req.session.user.email;
  var roomName = req.body.name;
  User.findOne({email: currentUserEmail}, function(err, user){
    user.roomName = roomName;
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

router.post('/acceptinvite', gatherBills, function(req, res){
  var acceptInvite = req.body.inviteStatusAccept;
  if (acceptInvite){
    User.findOne({email: req.session.user.email}, function(err, user){
      user.roomName = user.roomInvites[0].roomName;

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
    User.findOne({email: req.session.user.email}, function(err, user){
      user.roomInvites.pop();
      user.save();
    });
    res.send('you declined the invite');
  }
});

//user.room.roomInvites[0].roomName

router.post('/addroommate', function(req, res){
  User.findOne({email: req.body.roomMateEmail}, function(err, user){
    //if the invitee is found and the current user has a room
    if (user && req.session.user.room.roomName){
      user.roomInvites.push({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        roomName: req.session.user.room.roomName
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

router.post('/addbill', function(req, res){
  var billAmount = req.body.billAmount;
  var billType = req.body.billType;
  var email = req.session.user.email;

  User.findOne({email: req.session.user.email}, function(err, user){
    if (user.roomName){
      User.find({roomName: user.roomName}, function(err, allUsers){
        for (var i = 0; i < allUsers.length; i++){
          allUsers[i].bills.push({type: billType, amount: billAmount});
          allUsers[i].save();
        }         
      })
      res.redirect('/dashboard');
    } else{
      res.send('you need a room before you can add bills');
    }
  })
});

module.exports = router;