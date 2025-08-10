const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/user');
const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('companyName companyEmail companyAddress invoicePrefix invoiceSeq defaultCurrency currencyRates profilePhoto companyLogo');
    return res.json({ settings: user });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});


router.patch('/', auth, async (req, res) => {
  try {
    const { companyName, companyEmail, companyAddress, invoicePrefix, defaultCurrency, currencyRates, profilePhoto, companyLogo } = req.body || {};
    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { companyName, companyEmail, companyAddress, invoicePrefix, defaultCurrency, currencyRates, profilePhoto, companyLogo },
      { new: true }
    ).select('companyName companyEmail companyAddress invoicePrefix invoiceSeq defaultCurrency currencyRates profilePhoto companyLogo');
    return res.json({ settings: updated });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;


