// src/pages/appointments/Appointments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
//import "./Appointments.css";
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ date: "", patientId: "" });
  const [loading, setLoading] = useState(true);




  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  const handleAddAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments`,
        { ...newAppointment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div>
      <h1>Appointments</h1>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.date} - Patient ID: {appointment.patientId} - Status: {appointment.status}
          </li>
        ))}
      </ul>
      <h2>Add Appointment</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddAppointment();
        }}
      >
        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={newAppointment.patientId}
          onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
          required
        />
        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
};

export default Appointments;
