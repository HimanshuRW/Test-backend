const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  qrString: { type: String, required: true, unique: true },
  restaurantName: { type: String, required: true },
  tableNumber: { type: String, required: true },
  isBooked: { type: Boolean, required: false, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

qrCodeSchema.index({ restaurantName: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('QRCode', qrCodeSchema);

