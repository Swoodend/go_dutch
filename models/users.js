var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName : { type: String, required: true },
  email    : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  room: {
    roomies: Array
  },
  roomName: String,
  roomInvites: Array,
  bills: Array
});

module.exports = mongoose.model('User', userSchema);