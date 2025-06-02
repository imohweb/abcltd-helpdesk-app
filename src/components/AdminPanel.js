import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchMetrics();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/admin/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post('/admin/users', newUser);
      setNewUser({ name: '', email: '', role: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeactivateUser = async (id) => {
    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleExportTickets = async () => {
    try {
      const response = await axios.get('/admin/export-tickets', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tickets.csv'); // or .xlsx for Excel
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting tickets:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Create User</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create User
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeactivateUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Performance Metrics</h2>
        <p>Tickets Resolved by Agents:</p>
        <ul>
          {metrics.agents &&
            metrics.agents.map((agent) => (
              <li key={agent.id}>{agent.name}: {agent.ticketsResolved}</li>
            ))}
        </ul>
      </div>

      <button onClick={handleExportTickets} className="bg-green-500 text-white px-4 py-2 rounded">
        Export Tickets
      </button>
    </div>
  );
}

export default AdminPanel;
