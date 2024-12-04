const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./auth').router; // Import authentication routes
const dashboardRoutes = require('./dashboard'); // Import the dashboard routes
const telemedicineRouter = require('./telemedicine');
const emergenciesRouter = require('./emergencies'); 
const diagnosticsRouter = require('./diagnostics'); // Adjust path as needed
const rolesRouter = require('./roles');
const appointmentsRouter = require('./appointments'); 
const medicalRouter = require('./medicalRecords');


const app = express();

// Middleware Setup

app.use(cors({
  origin: 'http://localhost:3000', // The React frontend URL
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));

app.use(bodyParser.json());

app.use(express.json());

// Route Handling
app.use('/api/auth', authRoutes); // Auth routes for login and JWT generation
app.use('/api', dashboardRoutes); // Dashboard route for role-based redirection
app.use('/api', telemedicineRouter);
app.use('/api', emergenciesRouter);
app.use('/api', diagnosticsRouter);


app.use('/api', rolesRouter);
app.use('/api', appointmentsRouter);
app.use('/api', medicalRouter);

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
