const express = require('express');
const { authenticateToken } = require('./auth');
const pool = require('./db');

const router = express.Router();
router.get('/test', (req, res) => {
    res.send('Emergency route is working!');
});
// Emergency Override

router.post('/emergency-override', authenticateToken, async (req, res) => {
    console.log('Emergency override endpoint hit');
    console.log('Request body:', req.body);

    const { user_id } = req.user;
    const { patient_id, reason } = req.body;

    try {
        // Check if user is authorized for override
        const userRole = await pool.query('SELECT role_name FROM roles WHERE role_id = (SELECT role_id FROM users WHERE user_id = $1)', [user_id]);

        if (!['Admin', 'Doctor', 'Nurse'].includes(userRole.rows[0].role_name)) {
            return res.status(403).json({ error: 'Only Admin, Doctor, or Nurse can perform an emergency override' });
        }

        // Log the override
        await pool.query(
            'INSERT INTO emergency_overrides (user_id, patient_id, reason) VALUES ($1, $2, $3)',
            [user_id, patient_id, reason]
        );

        // Fetch patient details for immediate access
        const patient = await pool.query('SELECT * FROM patients WHERE patient_id = $1', [patient_id]);

        if (patient.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.json({
            message: 'Emergency override successful',
            patient: patient.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
