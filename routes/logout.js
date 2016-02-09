var express = require('express')
var router = express.Router();
var sessions = require('client-sessions');

router.get('/', function(req, res){
  if (req.session && req.session.user){
    req.session.reset();
    res.redirect('/');
  } else {
    next();
  }
});




module.exports = router;