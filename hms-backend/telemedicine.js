const express = require('express');
const { authenticateToken } = require('./auth');
const pool = require('./db');

const router = express.Router();

const { isDate } = require('validator');

router.post('/create-session', authenticateToken, async (req, res) => {
    const { patient_id, doctor_id, session_time } = req.body;

    if (!isDate(session_time)) {
        return res.status(400).json({ error: 'Invalid session time' });
    }

    try {
        const session_link = `https://telemed.example.com/session/${Date.now()}`;

        await pool.query(
            'INSERT INTO telemedicine_sessions (patient_id, doctor_id, session_time, session_link) VALUES ($1, $2, $3, $4)',
            [patient_id, doctor_id, session_time, session_link]
        );

        res.json({ session_link });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;



