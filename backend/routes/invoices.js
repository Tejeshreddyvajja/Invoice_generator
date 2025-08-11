const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');
const Invoice = require('../models/invoice');
const Customer = require('../models/customer');
const User = require('../models/user');
const { generateInvoicePdf } = require('../services/pdf');
const { sendInvoiceEmail } = require('../services/mailer');
const router = express.Router();

function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

async function generateNextInvoiceNumber(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const seq = user.invoiceSeq || 1;
  const prefix = user.invoicePrefix || 'INV-';
  user.invoiceSeq = seq + 1;
  await user.save();
  return `${prefix}${String(seq).padStart(5, '0')}`;
}

  router.post('/', auth, async (req, res) => {
  try {
    const { customerId, items = [], currency, notes, issueDate, dueDate } = req.body || {};
    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'customerId and at least one item are required' });
    }

    const customer = await Customer.findOne({ _id: customerId, userId: req.user.userId });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    // determine currency
    let selectedCurrency = currency;
    if (!selectedCurrency) {
      const user = await User.findById(req.user.userId);
      selectedCurrency = user?.defaultCurrency || 'USD';
    }

    const mapped = items.map(i => {
      const qty = Number(i.quantity || 0);
      const unit = Number(i.unitPrice || 0);
      const tax = Number(i.taxRate || 0);
      const lineTotal = round2(qty * unit * (1 + tax / 100));
      return {
        productId: i.productId || undefined,
        name: i.name,
        description: i.description,
        quantity: qty,
        unitPrice: unit,
        taxRate: tax,
        lineTotal,
      };
    });

    const subtotal = round2(mapped.reduce((s, i) => s + i.quantity * i.unitPrice, 0));
    const taxTotal = round2(mapped.reduce((s, i) => s + i.quantity * i.unitPrice * (i.taxRate / 100), 0));
    const total = round2(subtotal + taxTotal);

    const invoiceNumber = await generateNextInvoiceNumber(req.user.userId);
    const invoice = await Invoice.create({
      userId: req.user.userId,
      customerId,
      invoiceNumber,
      status: 'draft',
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      currency: selectedCurrency,
      notes,
      items: mapped,
      subtotal,
      taxTotal,
      total,
    });

    // Try to auto-generate PDF and email it to the customer if an email exists.
    // This should not block invoice creation; failures are reported but do not change the 201 response.
    let emailSent = false;
    try {
      if (customer?.email) {
        const outDir = path.join(__dirname, '..', 'storage', 'invoices', String(req.user.userId));
        const { filePath, fileName } = await generateInvoicePdf(
          { invoice, customer, seller: user || (await User.findById(req.user.userId)) },
          outDir
        );
        const subject = `Invoice ${invoice.invoiceNumber}`;
        await sendInvoiceEmail({
          to: customer.email,
          subject,
          text: `Please find attached invoice ${invoice.invoiceNumber}`,
          html: `<p>Please find attached invoice <b>${invoice.invoiceNumber}</b>.</p>`,
          attachments: [{ filename: fileName, path: filePath }],
        });
        // Mark as sent on successful email
        invoice.status = 'sent';
        await invoice.save();
        emailSent = true;
      }
    } catch (e) {
      // Intentionally swallow errors to avoid failing invoice creation
      console.error('Auto email failed:', e?.message || e);
    }

    return res.status(201).json({ invoice, emailSent });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = { userId: req.user.userId };
    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('customerId', 'name email');

    const total = await Invoice.countDocuments(query);
    return res.json({ data: invoices, total });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.userId })
      .populate('customerId', 'name email address');
    if (!inv) return res.status(404).json({ msg: 'Not found' });
    return res.json({ invoice: inv });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!['draft', 'sent', 'paid', 'void'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    const inv = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status },
      { new: true }
    );
    if (!inv) return res.status(404).json({ msg: 'Not found' });
    return res.json({ invoice: inv });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const del = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!del) return res.status(404).json({ msg: 'Not found' });
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

// Generate PDF and return file path
router.post('/:id/pdf', auth, async (req, res) => {
  try {
    const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!inv) return res.status(404).json({ msg: 'Not found' });
    const customer = await Customer.findById(inv.customerId);
    const seller = await User.findById(req.user.userId);
    const outDir = path.join(__dirname, '..', 'storage', 'invoices', String(req.user.userId));
    const { filePath, fileName } = await generateInvoicePdf({ invoice: inv, customer, seller }, outDir);
    return res.json({ filePath, fileName });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Email invoice PDF to customer
router.post('/:id/send', auth, async (req, res) => {
  try {
    const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!inv) return res.status(404).json({ msg: 'Not found' });
    const customer = await Customer.findById(inv.customerId);
    const seller = await User.findById(req.user.userId);
    if (!customer?.email) return res.status(400).json({ msg: 'Customer email not set' });

    const outDir = path.join(__dirname, '..', 'storage', 'invoices', String(req.user.userId));
    const { filePath, fileName } = await generateInvoicePdf({ invoice: inv, customer, seller }, outDir);
    const subject = `Invoice ${inv.invoiceNumber}`;
    await sendInvoiceEmail({
      to: customer.email,
      subject,
      text: `Please find attached invoice ${inv.invoiceNumber}`,
      html: `<p>Please find attached invoice <b>${inv.invoiceNumber}</b>.</p>`,
      attachments: [{ filename: fileName, path: filePath }],
    });
    return res.json({ msg: 'Sent' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Download invoice PDF (auth required)
router.get('/:id/pdf/download', auth, async (req, res) => {
  try {
    const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!inv) return res.status(404).json({ msg: 'Not found' });
    const customer = await Customer.findById(inv.customerId);
    const seller = await User.findById(req.user.userId);
    const outDir = path.join(__dirname, '..', 'storage', 'invoices', String(req.user.userId));
    const expectedPath = path.join(outDir, `${inv.invoiceNumber}.pdf`);
    let filePath = expectedPath;
    let fileName = `${inv.invoiceNumber}.pdf`;
    if (!fs.existsSync(expectedPath)) {
      const gen = await generateInvoicePdf({ invoice: inv, customer, seller }, outDir);
      filePath = gen.filePath;
      fileName = gen.fileName;
    }
    return res.download(filePath, fileName);
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});


