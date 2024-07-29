const MenuItem = require('../models/MenuItem');

exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantName } = req.params;
    const menuItems = await MenuItem.find({ restaurantName });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve menu items', error });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { restaurantName, name, description, price } = req.body;
    const menuItem = new MenuItem({ restaurantName, name, description, price });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create menu item', error });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item', error });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByIdAndDelete(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item', error });
  }
};

// TODO : Add controller to toggle the status of a menuItem
