// src/pages/Diagnostics.js
import React, { useState } from "react";
import axios from "axios";

const Diagnostics = () => {
  const [symptoms, setSymptoms] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/diagnostics`,
        { symptoms },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(response.data);
      setError("");
    } catch (err) {
      console.error("Diagnostics error:", err);
      setError("Error fetching diagnostic results. Please try again.");
    }
  };

  return (
    <div>
      <h1>Diagnostics</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Symptoms:
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe symptoms here"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {results && (
        <div>
          <h3>Diagnostic Results</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Diagnostics;
