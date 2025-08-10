const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
require('dotenv').config();

// SIGNUP
router.post('/signup', async (req, res) => {
  const { email, password, companyName } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email: normalizedEmail, password: hashed, companyName });

    await user.save();
    res.status(201).json({ msg: 'Signup successful' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Wrong password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return res.status(200).json({ token, user: { email: user.email, companyName: user.companyName } });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('email companyName');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
