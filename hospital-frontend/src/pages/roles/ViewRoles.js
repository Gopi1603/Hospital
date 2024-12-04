// src/pages/roles/ViewRoles.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoles(response.data.roles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  if (loading) return <div>Loading roles...</div>;

  return (
    <div>
      <h2>Role Management</h2>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>{role.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewRoles;
