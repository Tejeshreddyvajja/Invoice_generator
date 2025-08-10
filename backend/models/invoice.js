const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0 },
  lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoiceNumber: { type: String, required: true, index: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'void'], default: 'draft' },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date },
  currency: { type: String, default: 'USD' },
  notes: { type: String },
  items: { type: [invoiceItemSchema], default: [] },
  subtotal: { type: Number, required: true, min: 0 },
  taxTotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  pdfUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);

