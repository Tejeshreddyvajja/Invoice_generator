const express = require('express');
const auth = require('../middleware/authMiddleware');
const Product = require('../models/product');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, unitPrice, currency = 'USD', taxRate = 0 } = req.body || {};
    if (!name || unitPrice == null) return res.status(400).json({ msg: 'name and unitPrice are required' });
    const product = await Product.create({ userId: req.user.userId, name, description, unitPrice, currency, taxRate });
    return res.status(201).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const find = { userId: req.user.userId };
    if (q) find.name = { $regex: q, $options: 'i' };
    const products = await Product.find(find).sort({ createdAt: -1 });
    return res.json({ data: products });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!product) return res.status(404).json({ msg: 'Not found' });
    return res.json({ product });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, description, unitPrice, currency, taxRate } = req.body || {};
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, description, unitPrice, currency, taxRate },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    return res.json({ product: updated });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const del = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!del) return res.status(404).json({ msg: 'Not found' });
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;


