const express = require('express');
const auth = require('../middleware/authMiddleware');
const Customer = require('../models/customer');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body || {};
    if (!name) return res.status(400).json({ msg: 'Name is required' });
    const customer = await Customer.create({ userId: req.user.userId, name, email, phone, address, notes });
    return res.status(201).json({ customer });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const find = { userId: req.user.userId };
    if (q) find.name = { $regex: q, $options: 'i' };
    const customers = await Customer.find(find).sort({ createdAt: -1 });
    return res.json({ data: customers });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!customer) return res.status(404).json({ msg: 'Not found' });
    return res.json({ customer });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body || {};
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, email, phone, address, notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    return res.json({ customer: updated });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const del = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!del) return res.status(404).json({ msg: 'Not found' });
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;


