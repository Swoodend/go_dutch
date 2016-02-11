var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  name: String,
  users: Array
});