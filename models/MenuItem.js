const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
