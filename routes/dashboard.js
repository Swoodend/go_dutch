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
  res.render('../views/dashboard');
});


module.exports = router;