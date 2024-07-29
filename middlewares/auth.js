const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');

exports.RestraAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.restaurant = await Restaurant.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
exports.DevAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token : and Me and Nisha will kill u if u try to hack our system... !' });
  }
  try {
    if(token==process.env.DEVTOKEN){
      next();
    } else {
      throw new Error("SORRY, Yr token is wrong... and Me and Nisha will kill u if u try to hack our system... !");
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed : and Me and Nisha will kill u if u try to hack our system... !' });
  }
};
