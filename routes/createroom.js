var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/users');
var User = mongoose.model('User');

function gatherBills(req, res, next){
  var roomName = req.session.user.roomInvites[0].roomName;
  var email = req.session.user.email;

  User.find({'room.roomName': roomName}, function(err, allUsers){
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
  res.render('createroom', {user: req.user});
});

router.post('/', function(req, res){
  var currentUserEmail = req.session.user.email;
  var roomName = req.body.name;
  User.findOne({email: currentUserEmail}, function(err, user){
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

router.post('/acceptinvite', gatherBills, function(req, res){
  var acceptInvite = req.body.inviteStatusAccept;
  if (acceptInvite){

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
  var amount = req.body.billAmount;
  var type = req.body.billType;
  var roomName = req.session.user.room.roomName;
  var email = req.session.user.email;
  //user must have a room to make bills
  if (roomName){
    User.findOne({email: email}, function(err, user){
      user.bills.push({
        type: type,
        amount: amount
      });
      user.save(function(err){
        if (!err){
          res.redirect('/dashboard');
        } else{
          res.send(err);
        }
      })
    });
  } else {
    res.send('create or join a room before creating bills');
  }


});

module.exports = router;