const nodemailer = require('nodemailer');

function createTransportFromEnv() {
  // Supports both SMTP and Ethereal (for testing)
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials are not configured');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendInvoiceEmail({ to, subject, text, html, attachments }) {
  const transporter = createTransportFromEnv();
  const info = await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text, html, attachments });
  return info;
}

module.exports = { sendInvoiceEmail };


