var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('createroom');
});

router.post('/', function(req, res){
  //create a room associated with the user in the DB
  //the room should have the given name from the form
  // the room-users(ie ppl living in room) should have the only the user who created it
  res.render('dashboard');
});

module.exports = router;