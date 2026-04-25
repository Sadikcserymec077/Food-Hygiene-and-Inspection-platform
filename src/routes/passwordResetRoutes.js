const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./src/config/dbConnect');

const JWT_SECRET = process.env.SESSION_SECRET || 'food-hygiene-reset-secret';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// ─── Table lookup for each role ──────────────────────────────────────
const ROLE_TABLE = {
    user: { table: 'users', loginPage: '/userLogin' },
    inspector: { table: 'inspectors', loginPage: '/inspectorLogin' },
    admin: { table: 'admins', loginPage: '/adminLogin' }
};

// ─── GET  /forgot-password  (show the form) ──────────────────────────
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword', {});
});

// ─── POST /forgot-password  (generate reset token) ───────────────────
router.post('/forgot-password', async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role || !ROLE_TABLE[role]) {
        return res.render('forgotPassword', { error: 'Please select a role and enter your email.' });
    }

    try {
        const config = ROLE_TABLE[role];
        const [rows] = await db.query(`SELECT id, email FROM ${config.table} WHERE email = ?`, [email]);

        // Always show success to prevent email enumeration attacks
        const successMsg = 'If that email exists in our system, a reset link has been shown below. Copy and open it in your browser.';

        if (rows.length === 0) {
            return res.render('forgotPassword', { success: successMsg });
        }

        const user = rows[0];

        // Create a short-lived JWT token (15 minutes)
        const token = jwt.sign(
            { id: user.id, email: user.email, role },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink = `${BASE_URL}/reset-password?token=${token}&role=${role}`;

        // ── If nodemailer/email is configured, send it; otherwise log to console ──
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                });

                await transporter.sendMail({
                    from: `"Food Hygiene Platform" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: '🔐 Reset Your Password',
                    html: `
            <div style="font-family:Segoe UI,sans-serif;max-width:500px;margin:auto;padding:30px;border-radius:12px;background:#f9fafb">
              <h2 style="color:#1d4ed8">Password Reset Request</h2>
              <p>Hello! We received a request to reset your password for the Food Hygiene Inspection Platform.</p>
              <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
              <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:14px 28px;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);color:white;text-decoration:none;border-radius:8px;font-weight:bold">Reset My Password</a>
              <p style="color:#9ca3af;font-size:12px">If you didn't request this, please ignore this email. Your password won't be changed.</p>
            </div>
          `
                });

                return res.render('forgotPassword', { success: successMsg });

            } catch (emailErr) {
                console.error('Email send error:', emailErr.message);
                // Fall through to console log fallback
            }
        }

        // ── Fallback: show the reset link directly on the page (dev mode) ──
        console.log(`\n[PASSWORD RESET] Link for ${email} (${role}):\n${resetLink}\n`);
        return res.render('forgotPassword', {
            success: `Reset link generated! Since email is not configured, here is your reset link (valid for 15 min):\n${resetLink}`,
        });

    } catch (err) {
        console.error('Forgot password error:', err);
        res.render('forgotPassword', { error: 'Something went wrong. Please try again.' });
    }
});

// ─── GET  /reset-password (verify token & show new password form) ─────
router.get('/reset-password', (req, res) => {
    const { token, role } = req.query;

    if (!token || !role) {
        return res.render('resetPassword', { tokenValid: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.render('resetPassword', { tokenValid: true, token, role: decoded.role });
    } catch (err) {
        res.render('resetPassword', { tokenValid: false, error: 'Your reset link has expired or is invalid.' });
    }
});

// ─── POST /reset-password (update the password) ──────────────────────
router.post('/reset-password', async (req, res) => {
    const { token, role, password, confirmPassword } = req.body;

    if (!token || !role || !password) {
        return res.render('resetPassword', { tokenValid: false, error: 'Invalid request.' });
    }

    if (password !== confirmPassword) {
        return res.render('resetPassword', { tokenValid: true, token, role, error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
        return res.render('resetPassword', { tokenValid: true, token, role, error: 'Password must be at least 6 characters.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const config = ROLE_TABLE[decoded.role];

        if (!config) {
            return res.render('resetPassword', { tokenValid: false, error: 'Invalid role in token.' });
        }

        await db.query(`UPDATE ${config.table} SET password = ? WHERE id = ?`, [password, decoded.id]);

        // Redirect to the correct login page with a success flag
        res.redirect(`${config.loginPage}?reset=success`);

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.render('resetPassword', { tokenValid: false, error: 'Your reset link has expired. Please request a new one.' });
        }
        console.error('Reset password error:', err);
        res.render('resetPassword', { tokenValid: false, error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
