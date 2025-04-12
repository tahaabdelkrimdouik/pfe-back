const express = require('express');
const router = express.Router();
const { createAccount, loginUser } = require('../controllers/user-controller');

const validateInput = (req, res, next) => {
  if (req.path === '/signup') {
    const { username, firstName, lastName, phoneNumber, reference } = req.body;
    if (!username || !firstName || !lastName || !phoneNumber || !reference) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  }
  if (req.path === '/login') {
    const { phoneNumber, reference } = req.body;
    if (!phoneNumber || !reference) {
      return res.status(400).json({ error: 'Phone number and reference are required' });
    }
  }
  next();
};

router.post('/login', validateInput, loginUser);
router.post('/signup', validateInput, createAccount);

module.exports = router;