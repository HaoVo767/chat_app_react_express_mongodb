const userModel = require("../Models/userModel");

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { findUser, getAllUser };
