const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('./auth'); // Ensure `auth.js` exports this function

const router = express.Router();

// Diagnostics API
router.post('/diagnostics', authenticateToken, async (req, res) => {
    const { symptoms } = req.body;

    try {
        const response = await axios.post('http://localhost:5001/diagnose', { symptoms });
        res.json({ diagnosis: response.data.diagnosis });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Diagnostic service unavailable');
    }
});

module.exports = router;
