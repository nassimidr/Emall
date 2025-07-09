import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendMail({ to, subject, text, html, from }) {
  return transporter.sendMail({
    from: from || process.env.GMAIL_USER,
    to,
    subject,
    text,
    html,
  });
} 