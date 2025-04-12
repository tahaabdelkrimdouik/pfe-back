const express = require('express');
const router = express.Router();
const { createAccount, loginUser } = require('../controllers/user-controller');

const validateInput = (req, res, next) => {
  const { username, password, firstName, lastName, phoneNumber, reference } = req.body;
  if (req.path === '/signup') {
    if (!username || !password || !firstName || !lastName || !phoneNumber || !reference) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  }
  if (req.path === '/login') {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  }
  next();
};

router.post('/login', validateInput, loginUser);
router.post('/signup', validateInput, createAccount);

module.exports = router;