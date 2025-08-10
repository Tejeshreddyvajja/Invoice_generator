const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  companyName: { type: String, trim: true },
  companyEmail: { type: String, trim: true },
  companyAddress: { type: String, trim: true },
  invoicePrefix: { type: String, default: 'INV-' },
  invoiceSeq: { type: Number, default: 1 },
  defaultCurrency: { type: String, default: 'USD' },
  currencyRates: { type: Map, of: Number, default: { USD: 1 } },
  profilePhoto: { type: String, trim: true, default: '' }, // URL or base64
  companyLogo: { type: String, trim: true, default: '' }, // URL or base64
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
