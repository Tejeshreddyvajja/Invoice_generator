const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function generateInvoicePdf({ invoice, customer, seller }, outputDir) {
  ensureDir(outputDir);
  const fileName = `${invoice.invoiceNumber}.pdf`;
  const filePath = path.join(outputDir, fileName);

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(22).text('Invoice', { align: 'right' });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Invoice No: ${invoice.invoiceNumber}`, { align: 'right' });
  doc.text(`Issue Date: ${dayjs(invoice.issueDate).format('YYYY-MM-DD')}`, { align: 'right' });
  if (invoice.dueDate) doc.text(`Due Date: ${dayjs(invoice.dueDate).format('YYYY-MM-DD')}`, { align: 'right' });

  doc.moveDown(1);
  doc.fontSize(12).text(`From: ${seller.companyName || ''}`);
  if (seller.companyEmail) doc.text(seller.companyEmail);
  if (seller.companyAddress) doc.text(seller.companyAddress);

  doc.moveDown(1);
  doc.text(`Bill To: ${customer.name}`);
  if (customer.email) doc.text(customer.email);
  if (customer.address) doc.text(customer.address);

  doc.moveDown(1);
  doc.fontSize(12).text('Items');
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const colX = [50, 260, 340, 420, 500];
  doc.fontSize(10).text('Item', colX[0], tableTop);
  doc.text('Qty', colX[1], tableTop);
  doc.text('Unit', colX[2], tableTop);
  doc.text('Tax %', colX[3], tableTop);
  doc.text('Total', colX[4], tableTop, { align: 'right' });

  let y = tableTop + 18;
  invoice.items.forEach((i) => {
    doc.text(i.name, colX[0], y);
    doc.text(String(i.quantity), colX[1], y);
    doc.text(`${invoice.currency} ${i.unitPrice.toFixed(2)}`, colX[2], y);
    doc.text(`${i.taxRate}%`, colX[3], y);
    doc.text(`${invoice.currency} ${i.lineTotal.toFixed(2)}`, colX[4], y, { align: 'right' });
    y += 16;
  });

  doc.moveDown(1.5);
  doc.text(`Currency: ${invoice.currency}`, { align: 'right' });
  doc.text(`Subtotal: ${invoice.currency} ${invoice.subtotal.toFixed(2)}`, { align: 'right' });
  doc.text(`Tax: ${invoice.currency} ${invoice.taxTotal.toFixed(2)}`, { align: 'right' });
  doc.fontSize(12).text(`Total: ${invoice.currency} ${invoice.total.toFixed(2)}`, { align: 'right' });

  if (invoice.notes) {
    doc.moveDown(1);
    doc.fontSize(10).text(`Notes: ${invoice.notes}`);
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve({ filePath, fileName }));
    stream.on('error', reject);
  });
}

module.exports = { generateInvoicePdf };


