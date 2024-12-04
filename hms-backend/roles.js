// roles.js
const express = require('express');
const { authenticateToken } = require('./auth');
const pool = require('./db');

const router = express.Router();

// Middleware to check if the user is an admin (role_id = 1)
const isAdmin = (req, res, next) => {
    if (req.user.role_id !== 1) {  // Assuming role_id = 1 is Admin
        return res.status(403).json({ error: 'Access denied: You do not have permission to perform this action' });
    }
    next();
};

// Fetch all roles - Admin only
router.get('/roles', authenticateToken, isAdmin, async (req, res) => {
    try {
        const roles = await pool.query('SELECT * FROM roles');
        res.json(roles.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Fetch permissions for a specific role - Admin only
router.get('/roles/:role_id/permissions', authenticateToken, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    try {
        const permissions = await pool.query(
            'SELECT p.permission_id, p.permission_name FROM permissions p INNER JOIN role_permission rp ON p.permission_id = rp.permission_id WHERE rp.role_id = $1',
            [role_id]
        );
        res.json(permissions.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /roles: Create a new role - Admin only
router.post('/roles', authenticateToken, isAdmin, async (req, res) => {
    const { role_name } = req.body;

    if (!role_name) {
        return res.status(400).json({ error: 'Role name is required' });
    }

    try {
        // Insert the new role into the database
        const newRole = await pool.query(
            'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
            [role_name]
        );

        res.json({ message: 'Role created successfully', role: newRole.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /roles/:role_id/permissions: Assign permissions to a role - Admin only
router.post('/roles/:role_id/permissions', authenticateToken, isAdmin, async (req, res) => {
    const { role_id } = req.params;
    const { permission_ids } = req.body;

    if (!permission_ids || !Array.isArray(permission_ids) || permission_ids.length === 0) {
        return res.status(400).json({ error: 'At least one permission_id is required' });
    }

    try {
        // Loop through the permission_ids and insert them into the role_permission table
        for (let permission_id of permission_ids) {
            await pool.query(
                'INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2)',
                [role_id, permission_id]
            );
        }

        res.json({ message: 'Permissions assigned to role successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /roles/:role_id/permissions/:permission_id: Delete a permission from a role - Admin only
router.delete('/roles/:role_id/permissions/:permission_id', authenticateToken, isAdmin, async (req, res) => {
    const { role_id, permission_id } = req.params;

    try {
        // Check if the permission exists for the given role
        const permission = await pool.query(
            'SELECT * FROM role_permission WHERE role_id = $1 AND permission_id = $2',
            [role_id, permission_id]
        );

        if (permission.rows.length === 0) {
            return res.status(404).json({ error: 'Permission not found for this role' });
        }

        // Delete the permission from the role_permission table
        await pool.query(
            'DELETE FROM role_permission WHERE role_id = $1 AND permission_id = $2',
            [role_id, permission_id]
        );

        res.json({ message: 'Permission removed from role successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /roles/:role_id: Delete a role - Admin only
router.delete('/roles/:role_id', authenticateToken, isAdmin, async (req, res) => {
    const { role_id } = req.params;

    try {
        // Check if the role exists before attempting to delete
        const role = await pool.query('SELECT * FROM roles WHERE role_id = $1', [role_id]);
        if (role.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Optional: Delete associated permissions first if necessary
        // For example, you might want to delete role_permission entries before deleting the role itself
        await pool.query('DELETE FROM role_permission WHERE role_id = $1', [role_id]);

        // Delete the role
        await pool.query('DELETE FROM roles WHERE role_id = $1', [role_id]);

        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
