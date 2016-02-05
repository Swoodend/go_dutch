var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('login');
});

router.post('/', function(req, res){
  // find user in databse, verify password, set session
  //check invites middleware if login successful
  res.redirect('dashboard');
});



module.exports = router;