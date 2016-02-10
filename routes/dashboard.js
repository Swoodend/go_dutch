var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var User = mongoose.model('User');

function checkSession(req,res,next){
  console.log('DASHBOARD ONE' )
  console.log(req.session.user);
  if (req.session.user){
    console.log('we in here');
    next();
  } else{
    res.redirect('/login');
  }
}

router.get('/', checkSession, function(req, res){
  console.log('do i get called');
  res.render('../views/dashboard');
});


module.exports = router;