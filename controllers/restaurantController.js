const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Restaurant
exports.registerRestaurant = async (req, res) => {
  const { ownerName, email, phone, password, restaurantName } = req.body;
  try {
    const restaurant = new Restaurant({ ownerName, email, phone, password, restaurantName });
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register restaurant', error });
  }
};

// Login Restaurant
exports.loginRestaurant = async (req, res) => {
  const { email, password, phone } = req.body;
  try {
    let restaurant = null;
    if (email) {
      restaurant = await Restaurant.findOne({ email });
    } else if (phone) {
      restaurant = await Restaurant.findOne({ phone });
    } else {
      return res.status(400).json({ message: "Please enter the Email or Phone !" });
    }
    if (!restaurant || !(await restaurant.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to login restaurant', error });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant || !(await restaurant.comparePassword(oldPassword))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    restaurant.password = newPassword;
    await restaurant.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error });
  }
};

// Generate OTP
exports.generateOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const otp = otpGenerator(6);
    restaurant.otp = otp;
    restaurant.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await restaurant.save();
    // Send OTP to user's phone or email (implementation depends on your setup)
    res.status(200).json({ message: 'OTP generated successfully', otp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate OTP', error });
  }
};

// Login with OTP
exports.loginWithOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ phone, otp, otpExpires: { $gte: Date.now() } });
    if (!restaurant) {
      return res.status(401).json({ message: 'Invalid OTP or OTP has expired' });
    }
    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to login with OTP', error });
  }
};


// return a random of number of given lenght
function otpGenerator(length) {
  if (length <= 0) {
    throw new Error('Length must be a positive integer');
  }

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(min + Math.random() * (max - min + 1));
}