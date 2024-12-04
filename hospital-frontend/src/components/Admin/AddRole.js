// src/components/Admin/AddRole.js
import React, { useState } from "react";
import axios from "axios";

const AddRole = () => {
  const [roleName, setRoleName] = useState("");

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/roles`,
        { name: roleName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Role added successfully!");
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  return (
    <form onSubmit={handleAddRole}>
      <div className="mb-3">
        <label className="form-label">Role Name</label>
        <input
          type="text"
          className="form-control"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Role</button>
    </form>
  );
};

export default AddRole;
