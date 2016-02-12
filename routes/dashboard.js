var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var User = mongoose.model('User');

function checkSession(req,res,next){
  if (req.session.user){
    next();
  } else{
    res.redirect('/login');
  }
}

router.get('/', checkSession, function(req, res){
  var user = User.findOne({email: req.session.user.email}, function(err, user){
    if (user){
      res.render('../views/dashboard', {user: user});
    } else{
      res.send('something went wrong');
    }
  });
});


module.exports = router;