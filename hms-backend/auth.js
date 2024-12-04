const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const router = express.Router();

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
     
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { user_id: user.rows[0].user_id, role_id: user.rows[0].role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Middleware to Verify Token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}



module.exports = { router, authenticateToken };