const mongoose = require('mongoose');
const User = require('../models/User');

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const validID = mongoose.isValidObjectId(userId);
    if(!validID){
      return res.status(400).json({ message: 'OYE !! Kya karna CHAHTE HO.. Atleast BSON id toh bhejo' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({ message: 'Failed to retrieve user', error });
  }
};

exports.createUser = async (req,res)=>{
  try {
    User.syncIndexes();
    const user = new User();
    user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({ message: 'Failed to retrieve user', error });
  }
}
