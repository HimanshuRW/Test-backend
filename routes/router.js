const express = require('express');
const router = express.Router();

const { RestraAuth, DevAuth } = require('../middlewares/auth');

const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuItemController');
const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const {registerQRCode,scanQRCode} = require('../controllers/qrCodeController');
const {
  registerRestaurant,
  loginRestaurant,
  changePassword,
  generateOTP,
  loginWithOTP
} = require('../controllers/restaurantController');
const {getAllDishesPerformance} = require('../controllers/statsController');
const {getUser,createUser} = require('../controllers/userController');

// RESTRA APIS
router.post('/menuItem',RestraAuth, createMenuItem);
router.put('/menuItem/:id',RestraAuth, updateMenuItem);
router.delete('/menuItem/:id',RestraAuth, deleteMenuItem);
router.post('/stats', RestraAuth,getAllDishesPerformance);

// DEV APIS
router.post('/restaurant', DevAuth,registerRestaurant);
router.post('/qrCode',DevAuth, registerQRCode);

// USER APIS
router.post('/order', createOrder);
router.put('/order/:id', updateOrderStatus);
router.get('/user/getMenu/:qrString', scanQRCode);
router.post('/login', loginRestaurant);
router.post('/changePassword', changePassword);
router.post('/generateOTP', generateOTP);
router.post('/loginWithOTP', loginWithOTP);
router.get('/user/:userId', getUser);
router.get('/user', createUser);

module.exports = router;
