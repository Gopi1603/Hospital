// src/pages/roles/AddRole.js
import React, { useState } from "react";
import axios from "axios";

const AddRole = () => {
  const [roleName, setRoleName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/roles`,
        { name: roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`Role "${response.data.name}" added successfully!`);
      setRoleName(""); // Clear the input
    } catch (error) {
      console.error("Error adding role:", error);
      setMessage("Failed to add role.");
    }
  };

  return (
    <div>
      <h2>Add Role</h2>
      <form onSubmit={handleAddRole}>
        <input
          type="text"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
        />
        <button type="submit">Add Role</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddRole;
