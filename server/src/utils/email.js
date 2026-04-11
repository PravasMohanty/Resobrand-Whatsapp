const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('./logger');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }
  return transporter;
};

/**
 * Generic send – all email functions go through here
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await getTransporter().sendMail({
      from: config.email.from,
      to,
      subject,
      html,
      text,
    });
    logger.info('Email sent', { to, subject, messageId: info.messageId });
    return info;
  } catch (err) {
    logger.error('Email send failed', { to, subject, error: err.message });
    throw err;
  }
};

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

const sendPasswordResetEmail = async (to, name, resetLink) => {
  await sendEmail({
    to,
    subject: 'Reset your Resobrand password',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#0a2d52">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your Resobrand password. Click the button below within <strong>15 minutes</strong>:</p>
        <a href="${resetLink}" style="display:inline-block;background:#46a96f;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="margin-top:24px;color:#666;font-size:13px">
          If you didn't request this, please ignore this email. Your password won't change.
        </p>
      </div>
    `,
    text: `Hi ${name},\n\nReset your password here: ${resetLink}\n\nLink expires in 15 minutes.`,
  });
};

const sendEmailVerification = async (to, name, verifyLink) => {
  await sendEmail({
    to,
    subject: 'Verify your Resobrand email',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#0a2d52">Verify your email address</h2>
        <p>Hi ${name}, welcome to Resobrand!</p>
        <p>Please verify your email address to activate your account:</p>
        <a href="${verifyLink}" style="display:inline-block;background:#46a96f;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
      </div>
    `,
    text: `Hi ${name},\n\nVerify your email here: ${verifyLink}`,
  });
};

const sendWelcomeEmail = async (to, name) => {
  await sendEmail({
    to,
    subject: 'Welcome to Resobrand 🎉',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#0a2d52">Welcome to Resobrand!</h2>
        <p>Hi ${name},</p>
        <p>Your account is ready. You're on a <strong>14-day free trial</strong> — explore all features.</p>
        <p>Happy sending! 🚀</p>
      </div>
    `,
    text: `Welcome to Resobrand, ${name}! Your 14-day trial has started.`,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendWelcomeEmail,
};
