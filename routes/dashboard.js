var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var User = mongoose.model('User');



router.get('/', function(req, res){
  if (req.session && req.session.user){
    User.findOne( { email: req.session.user.email }, function(err, user){
      if (!user){
        req.session.reset();
        res.redirect('/login', { error: 'couldn\'t find user. try again'});
      } else{
        res.locals.user = user;
        res.render('../views/dashboard');
      }
    });
  } else {
    res.redirect('/login');
  };
});

module.exports = router;