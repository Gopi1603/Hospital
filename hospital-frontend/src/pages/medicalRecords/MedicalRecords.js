import React, { useState, useEffect } from "react";
import axios from "axios";
//import "./MedicalRecords.css";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ patientId: "", description: "" });
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/medical-records`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/medical-records`,
        { ...newRecord },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRecords(); // Refresh the list
    } catch (error) {
      console.error("Error adding medical record:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) return <div className="loading">Loading medical records...</div>;

  return (
    <div className="medical-records-container">
      <h1>Medical Records</h1>
      <div className="records-list">
        {records.map((record) => (
          <div className="record-card" key={record.id}>
            <h3>Patient ID: {record.patientId}</h3>
            <p>{record.description}</p>
          </div>
        ))}
      </div>
      <h2>Add New Medical Record</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRecord();
        }}
        className="record-form"
      >
        <input
          type="text"
          placeholder="Patient ID"
          value={newRecord.patientId}
          onChange={(e) => setNewRecord({ ...newRecord, patientId: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newRecord.description}
          onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
          required
        ></textarea>
        <button type="submit">Add Record</button>
      </form>
    </div>
  );
};

export default MedicalRecords;
