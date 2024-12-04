const bcrypt = require('bcrypt');
const pool = require('./db'); 

// Function to hash passwords and update the database
async function hashAndUpdatePasswords() {
    try {
        // Retrieve all users where password is not already hashed
        // because i have runned other things priorly some data is alredy hashed so for such constrains 
        const result = await pool.query('SELECT user_id, password FROM users');
        const users = result.rows;
        for (const user of users) {
            // Checks if the password is already hashed
            if (user.password.startsWith('$2b$')) {
                console.log(`User ${user.user_id} already has a hashed password.`);
                continue; // Skip this user if the password is already hashed
            }
            // Hashesh onlythe plain password
            const hashedPassword = await bcrypt.hash(user.password, 10); 

            // Update in the db
            await pool.query(
                'UPDATE users SET password = $1 WHERE user_id = $2',
                [hashedPassword, user.user_id]
            );
            console.log(`User ${user.user_id} password updated to hashed value.`);
        }
    } catch (error) {
        console.error('Error processing passwords:', error);
    }
}
// Calling it
hashAndUpdatePasswords();
