var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('register');
});

router.post('/', function(req, res){
  // create a user in DB with form data
  res.redirect('dashboard');
});



module.exports = router;