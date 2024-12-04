import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/appointments/Appointments";
import MedicalRecords from "./pages/medicalRecords/MedicalRecords";
import NewMedicalRecord from "./pages/medicalRecords/NewMedicalRecord";
import Diagnostics from "./pages/diagnostics/Diagnostics";
import Emergencies from "./pages/emergencies/Emergencies";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/medical-records/new" element={<NewMedicalRecord />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/emergencies" element={<Emergencies />} />
      </Routes>
    </Router>
  );
}

export default App;
