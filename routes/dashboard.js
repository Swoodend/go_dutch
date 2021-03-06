var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var User = mongoose.model('User');

function verifyLogin(req,res,next){
  if (req.session.user){
    next();
  } else{
    res.redirect('/login');
  }
}

router.get('/', verifyLogin, function(req, res){
  User.findOne({email: req.session.user.email}, function(err, user){
    if (user){
      res.render('../views/dashboard', {user: user});
    } else{
      res.send('something went wrong');
    }
  });
});


module.exports = router;