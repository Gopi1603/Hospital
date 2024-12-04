// db.js
const { Pool } = require('pg'); //Pool class for postgress sql
require('dotenv').config(); // dotenv to load .env file data

// Created a new Pool instance to manage PostgreSQL database connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Get connection string from the .env file
});

module.exports = pool; // Exported the pool object (if it may be useful for other fieles)
