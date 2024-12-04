const express = require('express');
const { authenticateToken } = require('./auth'); // Import authentication middleware
const pool = require('./db'); // Import the database connection

const router = express.Router();

// Role-Based Dashboard Route
router.get('/dashboard', authenticateToken, async (req, res) => {
    const { role_id } = req.user; // Get the role_id from the JWT token
    try {
        // Query the database to get the role name from role_id
        const role = await pool.query('SELECT role_name FROM roles WHERE role_id = $1', [role_id]);

        // If role not found, return an error
        if (role.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Based on the role, send the appropriate dashboard message
        switch (role.rows[0].role_name) {
            case 'Admin':
                res.json({ message: 'Welcome Admin!' });
                break;
            case 'Doctor':
                res.json({ message: 'Welcome Doctor!' });
                break;
            case 'Nurse':
                res.json({ message: 'Welcome Nurse!' });
                break;
            case 'Receptionist':
                res.json({ message: 'Welcome Receptionist!' });
                break;
            case 'Patient':
                res.json({ message: 'Welcome Patient!' });
                break;
            default:
                res.status(403).json({ error: 'Access denied' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; // Export the router for use in other parts of the application
