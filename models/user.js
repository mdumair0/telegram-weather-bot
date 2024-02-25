const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  lastMessageTime: {
    type: Date,
    default: null
  },
  blocked: {
    type: Boolean, 
    default: false
  },
  messageFrequency: {
    type: Number,
    default: 5000
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
