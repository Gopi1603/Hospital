const bcrypt = require('bcrypt');

// The hashed passwords stored in the database for Tina Spencer and Bruce Wayne
const hashedPasswordTina = '$2b$10$Arw.cFl.Q6UPG69M/sKlmuHkUX8no1HvNtTHNk3QL3I2ixOPXXigO';
const hashedPasswordBruce = '$2b$10$WcV9xmiqK7.HnRzMXqynJOu9VcO9dHaK2eDYxYxKYwtne5fPzIZt2';

// Define the plaintext password you want to check (make sure you have the correct plaintext passwords)
const plaintextPasswordTina = 'receptionistpass123'; // Replace this with the correct plaintext password
const plaintextPasswordBruce = 'batmanpassword123'; // Replace this with the correct plaintext password

async function checkPassword() {
    try {
        // Compare the plaintext password with the hashed password for Tina
        const matchTina = await bcrypt.compare(plaintextPasswordTina, hashedPasswordTina);
        console.log(`Tina's password match: ${matchTina}`); // true if match, false if not

        // Compare the plaintext password with the hashed password for Bruce
        const matchBruce = await bcrypt.compare(plaintextPasswordBruce, hashedPasswordBruce);
        console.log(`Bruce's password match: ${matchBruce}`); // true if match, false if not

    } catch (error) {
        console.error('Error comparing passwords:', error);
    }
}
checkPassword();
