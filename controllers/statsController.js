// controllers/statsController.js
const Order = require('../models/Order');
const QRCode = require('../models/QRCode');

exports.getAllDishesPerformance = async (req, res) => {
  const { restaurantName, startDate } = req.body;

  try {
    // Find the creation date of the QRCode if no startDate is provided
    const qrCode = await QRCode.findOne({ restaurantName });
    const startDateFilter = startDate ? new Date(startDate) : new Date(qrCode.createdAt);

    // Filter orders by restaurant name and date range
    const orders = await Order.find({
      restaurantName,
      createdAt: { $gte: startDateFilter }
    });

    let userSet = new Set([]);

    // Aggregate sales data for all dishes, total customers, and total earnings
    const performanceData = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc.items[item.name]) {
          acc.items[item.name] = {
            quantity: 0,
            totalEarnings: 0
          };
        }
        acc.items[item.name].quantity += item.quantity;
        acc.items[item.name].totalEarnings += item.price * item.quantity;
        acc.totalEarnings += item.price * item.quantity;
      });
      userSet.add(order.userId.toString());
      acc.totalCustomers = userSet.size;
      return acc;
    }, { items: {}, totalCustomers: 0, totalEarnings: 0 });

    res.status(200).json(performanceData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve all dishes performance', error });
  }
};

