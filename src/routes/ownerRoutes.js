const express = require('express');
const router = express.Router();
const db = require('../config/dbConnect');

// ─── GET /ownerSignup ──────────────────────────────────────────────────
router.get('/ownerSignup', (req, res) => {
    res.render('ownerViews/ownerSignup');
});

// ─── POST /ownerSignup ─────────────────────────────────────────────────
router.post('/ownerSignup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
        return res.render('ownerViews/ownerSignup', { error: 'Name, email, and password are required!' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM owners WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.render('ownerViews/ownerSignup', { error: 'Email already registered as an Owner!' });
        }

        await db.query('INSERT INTO owners (name, email, phone, password) VALUES (?, ?, ?, ?)', [name, email, phone, password]);
        res.redirect('/ownerLogin?success=signup');
    } catch (err) {
        console.error('Owner Signup Error:', err);
        res.render('ownerViews/ownerSignup', { error: 'Registration failed. Try again.' });
    }
});

// ─── GET /ownerLogin ───────────────────────────────────────────────────
router.get('/ownerLogin', (req, res) => {
    res.render('ownerViews/ownerLogin');
});

// ─── POST /ownerLogin ──────────────────────────────────────────────────
router.post('/ownerLogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('ownerViews/ownerLogin', { error: 'All fields are required.' });
    }

    try {
        const [results] = await db.query('SELECT * FROM owners WHERE email = ?', [email]);

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).render('ownerViews/ownerLogin', { error: 'Invalid email or password.' });
        }

        req.session.ownerName = results[0].name;
        req.session.ownerEmail = results[0].email;
        res.redirect('/owner/dashboard');
    } catch (err) {
        console.error('Owner Login Error:', err);
        res.status(500).render('ownerViews/ownerLogin', { error: 'Internal server error.' });
    }
});

// ─── GET /owner/dashboard ──────────────────────────────────────────────
router.get('/owner/dashboard', async (req, res) => {
    if (!req.session.ownerEmail) {
        return res.redirect('/ownerLogin');
    }

    const ownerEmail = req.session.ownerEmail;
    const ownerName = req.session.ownerName;

    try {
        // 🔥 Magic Linking: Fetch all restaurants matching the owner's email
        const [restaurants] = await db.query(`
      SELECT r.*, 
             (SELECT ir.hygiene_score FROM inspection_reports ir WHERE ir.restaurant_id = r.id ORDER BY ir.submitted_at DESC LIMIT 1) AS live_score
      FROM restaurants r 
      WHERE r.email = ?
    `, [ownerEmail]);

        // Calculate aggregated stats
        const totalRestaurants = restaurants.length;
        const activeRestaurants = restaurants.filter(r => r.status === 'approved').length;
        const averageScore = restaurants.reduce((acc, curr) => acc + (parseFloat(curr.live_score) || 0), 0) / (restaurants.filter(r => r.live_score).length || 1);

        // Fetch reports tied to their restaurants
        let reports = [];
        if (restaurants.length > 0) {
            const restaurantIds = restaurants.map(r => r.id);
            [reports] = await db.query(`
        SELECT ir.*, r.name AS restaurant_name, i.name AS inspector_name
        FROM inspection_reports ir
        JOIN restaurants r ON ir.restaurant_id = r.id
        JOIN inspectors i ON ir.inspector_id = i.id
        WHERE ir.restaurant_id IN (?)
        ORDER BY ir.submitted_at DESC
      `, [restaurantIds]);
        }

        // Process JSON fields
        reports.forEach(r => {
            try { r.report_data = typeof r.report_json === 'string' ? JSON.parse(r.report_json) : (r.report_json || {}); } catch (e) { r.report_data = {}; };
            try { r.images = typeof r.image_paths === 'string' ? JSON.parse(r.image_paths) : (r.image_paths || []); } catch (e) { r.images = []; };
        });

        res.render('ownerViews/ownerDashboard', {
            ownerName,
            ownerEmail,
            restaurants,
            reports,
            stats: {
                totalRestaurants,
                activeRestaurants,
                averageScore: averageScore.toFixed(1)
            }
        });

    } catch (err) {
        console.error('Owner Dashboard Error:', err);
        res.status(500).send('Server Error');
    }
});

// ─── GET /owner/logout ─────────────────────────────────────────────────
router.get('/owner/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
