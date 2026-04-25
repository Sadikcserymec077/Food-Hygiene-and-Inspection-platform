const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/dbConnect');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.SESSION_SECRET || 'food-hygiene-reset-secret';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// ─── Table lookup for each role ──────────────────────────────────────
const ROLE_TABLE = {
    user: { table: 'users', loginPage: '/userLogin' },
    inspector: { table: 'inspectors', loginPage: '/inspectorLogin' },
    admin: { table: 'admins', loginPage: '/adminLogin' },
    owner: { table: 'owners', loginPage: '/ownerLogin' }
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

        // Send via email service (handles both SMTP and console fallback gracefully)
        await emailService.sendPasswordResetEmail(email, resetLink);
        return res.render('forgotPassword', { success: successMsg });

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
