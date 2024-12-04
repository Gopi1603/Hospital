const express = require('express');
const { authenticateToken } = require('./auth');
const pool = require('./db');

const router = express.Router();

// Add a medical record
router.post('/medical-records', authenticateToken, async (req, res) => {
    const { patient_id, doctor_id, record_date, diagnosis, treatment } = req.body;

    try {
        const newRecord = await pool.query(
            'INSERT INTO medical_records (patient_id, doctor_id, record_date, diagnosis, treatment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patient_id, doctor_id, record_date, diagnosis, treatment]
        );
        res.json(newRecord.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Fetch medical records for any patient (everyone can view)
router.get('/medical-records/:patient_id', authenticateToken, async (req, res) => {
    const { patient_id } = req.params;

    try {
        // Fetch the medical records for the specified patient
        const records = await pool.query(
            'SELECT * FROM medical_records WHERE patient_id = $1',
            [patient_id]
        );
        res.json(records.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
