const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
