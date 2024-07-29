const Order = require('../models/Order');
const QRCode = require('../models/QRCode');
const MenuItem = require('../models/MenuItem');
const Billing = require('../models/Billing');

exports.createOrder = async (req, res) => {
  try {
    const { qrString, items,userId } = req.body;
    console.log("qrString : ",qrString);
    // Check table status
    const qrCode = await QRCode.findOne({qrString});
    console.log("qrCode : ",qrCode);
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    console.log("qrCode.isBooked : ",qrCode.isBooked);
    
    if (qrCode.isBooked) {
      return res.status(400).json({ message: 'Table is already booked' });
    }
    
    // Update table status to booked
    // qrCode.isBooked = true;
    await qrCode.save();
    console.log("uooo");

    // Fetch menu item details and calculate total amount
    let totalAmount = 0;
    const orderedItems = [];
    
    for (const { menuItemId, quantity } of items) {
      const menuItem = await MenuItem.findById(menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${menuItemId} not found` });
      }
      
      const orderItem = {
        menuItem: menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
      };
      
      totalAmount += menuItem.price * quantity;
      orderedItems.push(orderItem);
    }
    console.log("before order controller");
    // Create order
    const order = new Order({ restaurantName : qrCode.restaurantName, tableNumber : qrCode.tableNumber, items: orderedItems, totalAmount,userId });

    // Create or find existing billing record
    let billing = await Billing.findOne({ userId, paymentStatus: 'pending' });
    if (!billing) {
        billing = new Billing({ userId, totalAmount, orders: [order._id] });
    } else {
        billing.totalAmount += totalAmount;
        billing.orders.push(order._id);
    }
    await billing.save();

    // Update order with billing reference
    order.billing = billing._id;
    await order.save();


    // Emit socket event to kitchen
    // const io = req.app.get('socketio');
    // io.to(restaurantName).emit('newOrder', { tableNumber, items: orderedItems });
    
    // Send response
    res.status(201).json({ message: 'Order placed successfully', totalAmount : billing.totalAmount });
  } catch (error) {
    console.log("error : ",error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const { restaurantName } = req.params;
    const orders = await Order.find({ restaurantName });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error });
  }
};
