// src/components/Admin/ViewRoles.js
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(response.data.roles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  if (loading) return <div>Loading roles...</div>;

  return (
    <div>
      <h2>Roles</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Role ID</th>
            <th>Role Name</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRoles;




