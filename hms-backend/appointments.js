const express = require('express');
const { authenticateToken } = require('./auth');  // Assuming this middleware checks JWT token
const pool = require('./db');  // Database connection pool

const router = express.Router();

// Utility function to check if the user is allowed to update the appointment
async function canUpdateAppointment(userId, appointmentId, role) {
    if (role === 'admin') {
        return true;  // Admins can update any appointment
    }

    // For doctors, check if they are associated with the appointment
    if (role === 'doctor') {
        const result = await pool.query(
            'SELECT * FROM appointments WHERE appointment_id = $1 AND doctor_id = $2',
            [appointmentId, userId]
        );
        return result.rows.length > 0;  // If the doctor is associated with the appointment, allow update
    }

    // Patients can update only their own appointments
    if (role === 'patient') {
        const result = await pool.query(
            'SELECT * FROM appointments WHERE appointment_id = $1 AND patient_id = $2',
            [appointmentId, userId]
        );
        return result.rows.length > 0;  // If the patient is the owner of the appointment, allow update (e.g., cancel or reschedule)
    }

    return false;  // Other roles cannot update appointments
}

// POST /appointments: Create an appointment
router.post('/appointments', authenticateToken, async (req, res) => {
    const { patient_id, doctor_id, date, status } = req.body;

    // Validate the input
    if (!patient_id || !doctor_id || !date || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure the status is one of the valid options ('Scheduled', 'Completed', 'Canceled')
    const validStatuses = ['Scheduled', 'Completed', 'Canceled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Valid statuses are: Scheduled, Completed, Canceled' });
    }

    try {
        const newAppointment = await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [patient_id, doctor_id, date, status]
        );        
        res.status(201).json(newAppointment.rows[0]);  // Return 201 status code for successful creation
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error: Could not create appointment' });
    }
});

// GET /appointments: Fetch appointments based on user role
router.get('/appointments', authenticateToken, async (req, res) => {
    const userId = req.user.user_id;  
    const userRole = req.user.role_id;  

    try {
        let appointments;

        if (userRole === 1) { // Admin (role_id = 1)
            // Admin can see all appointments
            appointments = await pool.query('SELECT * FROM appointments');
        } else if (userRole === 2) { // Doctor (role_id = 2)
            // Doctors can see appointments assigned to them
            appointments = await pool.query('SELECT * FROM appointments WHERE doctor_id = $1', [userId]);
        } else if (userRole === 3) { // Nurse (role_id = 3) or Receptionist (role_id = 5)
            // Nurses and receptionists can see all appointments (you can adjust if needed)
            appointments = await pool.query('SELECT * FROM appointments');
        } else if (userRole === 4) { // Patient (role_id = 4)
            // Patients can see only their own appointments
            appointments = await pool.query('SELECT * FROM appointments WHERE patient_id = $1', [userId]);
        } else {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(appointments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error: Could not fetch appointments' });
    }
});



// GET /appointments/:appointment_id: Fetch details of a specific appointment
router.get('/appointments/:appointment_id', authenticateToken, async (req, res) => {
    const { appointment_id } = req.params;

    try {
        const appointment = await pool.query(
            'SELECT * FROM appointments WHERE appointment_id = $1',
            [appointment_id]
        );

        if (appointment.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json(appointment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error: Could not fetch appointment details' });
    }
});

// PATCH /appointments/:appointment_id: Update appointment status
router.patch('/appointments/:appointment_id', authenticateToken, async (req, res) => {
    const { appointment_id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;  // Assuming user id is attached to the request in authenticateToken
    const userRole = req.user.role;  // Assuming role is attached to the request in authenticateToken

    // Validate the status input
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    // Ensure the status is one of the valid options ('Scheduled', 'Completed', 'Canceled')
    const validStatuses = ['Scheduled', 'Completed', 'Canceled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Valid statuses are: Scheduled, Completed, Canceled' });
    }

    try {
        // Check if the user can update this appointment
        const canUpdate = await canUpdateAppointment(userId, appointment_id, userRole);

        if (!canUpdate) {
            return res.status(403).json({ error: 'You do not have permission to update this appointment' });
        }

        const appointment = await pool.query(
            'SELECT * FROM appointments WHERE appointment_id = $1',
            [appointment_id]
        );

        if (appointment.rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const updatedAppointment = await pool.query(
            'UPDATE appointments SET status = $1 WHERE appointment_id = $2 RETURNING *',
            [status, appointment_id]
        );

        res.json(updatedAppointment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error: Could not update appointment status' });
    }
});

module.exports = router;