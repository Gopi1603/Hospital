// rename dummy-server.js to server.js its to test ( db.js , hash.js , auth.js , .env)
//and use postman or vscode extensions to check it 
//if postman PUT () body ()
//results if correct u should get a key incorrect wrong mail or password 
//anything else means setup or something is wrong check everything or contact me


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { router: authRouter } = require('./auth'); //for authentication routes
const pool = require('./db'); // database connection from db.js
require('dotenv').config(); // Loadingg environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;  // port 5000(we can set in .env)

// Middleware
app.use(cors()); //Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); //parse JSON requests

// Routes
app.use('/api/auth', authRouter);  

// Testing Database Connection
app.get('/api/test-db', async (req, res) => {
    try {
        // Simple query
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connection successful!', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database connection failed!', error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});