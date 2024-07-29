const QRCode = require('../models/QRCode');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');


exports.registerQRCode = async (req, res) => {
  try {
    const { qrString, restaurantName, tableNumber } = req.body;
    const qrCode = new QRCode({ qrString, restaurantName, tableNumber });
    await qrCode.save();
    res.status(201).json(qrCode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register QR code', error });
  }
};


exports.scanQRCode = async (req, res) => {
  try {
    const { qrString } = req.params;
    let points = 0;
    let userId;

    const {authorization} = req.headers;
    if(authorization && authorization!=='undefined' && authorization!=='null'){
      const user = await User.findById(authorization);
      if(user){
        points = user.points;
        userId = authorization;
      } else {
        return res.status(400).json({message : "authorization is wrong !"});
      }
    } else {
      const user = new User();
      await user.save();
      userId = user._id.toString(); 
    }
    
    // Find the QR code in the database
    const qrCode = await QRCode.findOne({ qrString });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Retrieve menu items for the restaurant associated with the QR code
    const menuItems = await MenuItem.find({ restaurantName: qrCode.restaurantName });

    // Construct response with restaurant details and menu items
    const response = {
      restaurantName: qrCode.restaurantName,
      tableNumber: qrCode.tableNumber,
      points,
      userId,
      menuItems
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve restaurant details', error });
  }
};
