// src/pages/medicalRecords/NewMedicalRecord.js
import React, { useState } from "react";
import axios from "axios";

const NewMedicalRecord = () => {
  const [patientId, setPatientId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/medical-records`,
        { patientId, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Medical record added successfully!");
      setError("");
    } catch (err) {
      console.error("Error adding medical record:", err);
      setError("Failed to add medical record.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Add Medical Record</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Add Record</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default NewMedicalRecord;
