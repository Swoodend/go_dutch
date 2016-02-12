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
  // actually find the user obj in the database and pass that in to the template
  // this will allow you to display the room info of the user :)
  res.render('../views/dashboard', {user: req.session.user});
});


module.exports = router;