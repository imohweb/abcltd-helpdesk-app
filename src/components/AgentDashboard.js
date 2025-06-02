import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets', { params: filters });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/tickets/${id}`, { status });
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleAddComment = async (id) => {
    try {
      await axios.post(`/tickets/${id}/comments`, { message: comment });
      setComment('');
      fetchTickets();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>

      <div className="mb-4">
        <label className="mr-2">Status:</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 mr-4"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <label className="mr-2">Priority:</label>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border p-2"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Priority</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="border border-gray-300 p-2">{ticket.title}</td>
              <td className="border border-gray-300 p-2">{ticket.status}</td>
              <td className="border border-gray-300 p-2">{ticket.priority}</td>
              <td className="border border-gray-300 p-2">{new Date(ticket.created_at).toLocaleString()}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleStatusChange(ticket.id, 'in-progress')}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Start Progress
                </button>
                <button
                  onClick={() => handleStatusChange(ticket.id, 'closed')}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Close
                </button>
                <div className="mt-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                    className="border p-2 w-full mb-2"
                  />
                  <button
                    onClick={() => handleAddComment(ticket.id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Add Comment
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgentDashboard;
