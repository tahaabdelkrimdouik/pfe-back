const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const createToken = (_id) => {
  const secret = process.env.SECRET || 'default-secret';
  return jwt.sign({ _id }, secret, { expiresIn: '3d' });
};

const loginUser = async (req, res) => {
  const { phoneNumber, reference } = req.body;
  try {
    const user = await User.login(phoneNumber, reference);
    const token = createToken(user._id);
    res.status(200).json({ username: user.username, phoneNumber, reference, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const createAccount = async (req, res) => {
  const { username, firstName, lastName, phoneNumber, reference } = req.body;
  try {
    const user = await User.createAccount(username, firstName, lastName, phoneNumber, reference);
    const token = createToken(user._id);
    res.status(201).json({ username, firstName, lastName, phoneNumber, reference, token });
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ error: 'Duplicate field value entered' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  createAccount,
  loginUser,
};