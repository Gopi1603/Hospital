// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Import components for Admin role management
import ViewRoles from "./roles/ViewRoles";
import AddRole from "./roles/AddRole";
import "./dash.css";
const Dashboard = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure token is present
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRole(response.data.role);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard role:", error);
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{role} Dashboard</h1>
      {role === "Admin" && <AdminDashboard />}
      {role === "Doctor" && <DoctorDashboard />}
      {role === "Nurse" && <NurseDashboard />}
      {role === "Patient" && <PatientDashboard />}
    </div>
  );
};

// Admin-specific dashboard with links
const AdminDashboard = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <ViewRoles />
    <AddRole />
    <div>
      <h3>Navigation</h3>
      <ul>
        <li>
          <Link to="/appointments">Manage Appointments</Link>
        </li>
        <li>
          <Link to="/medical-records">Manage Medical Records</Link>
        </li>
        <li>
          <Link to="/diagnostics">Diagnostics</Link>
        </li>
        <li>
          <Link to="/emergencies">Emergency Overrides</Link>
        </li>
      </ul>
    </div>
  </div>
);

// Doctor-specific dashboard
const DoctorDashboard = () => (
  <div>
    <h2>Doctor Dashboard</h2>
    <ul>
      <li>
        <Link to="/appointments">View Appointments</Link>
      </li>
      <li>
        <Link to="/diagnostics">Diagnostics</Link>
      </li>
    </ul>
  </div>
);

// Nurse-specific dashboard
const NurseDashboard = () => (
  <div>
    <h2>Nurse Dashboard</h2>
    <ul>
      <li>
        <Link to="/medical-records">Manage Patient Records</Link>
      </li>
      <li>
        <Link to="/emergencies">Emergency Overrides</Link>
      </li>
    </ul>
  </div>
);

// Patient-specific dashboard
const PatientDashboard = () => (
  <div>
    <h2>Patient Dashboard</h2>
    <ul>
      <li>
        <Link to="/appointments">View Your Appointments</Link>
      </li>
    </ul>
  </div>
);

export default Dashboard;
