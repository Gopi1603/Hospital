// src/pages/Emergencies.js
import React, { useState } from "react";
import axios from "axios";
//import "./emer.css";

const Emergencies = () => {
  const [emergencyData, setEmergencyData] = useState({ reason: "", details: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmergencyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/emergency-override`,
        emergencyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Assuming the server sends back a meaningful message
      setSuccessMessage(response.data.message || "Emergency override submitted successfully!");
      setError("");
    } catch (err) {
      console.error("Emergency Override error:", err);
      setError("Error submitting emergency override. Please try again.");
      setSuccessMessage("");
    }
  };
  
  return (
    <div>
      <h1>Emergency Overrides</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Reason:
          <input
            type="text"
            name="reason"
            value={emergencyData.reason}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Details:
          <textarea
            name="details"
            value={emergencyData.details}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Emergencies;
