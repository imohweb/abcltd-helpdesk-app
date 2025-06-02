import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 bg-gray-200 h-screen p-4">
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/customer-dashboard">Customer Dashboard</Link></li>
          <li><Link to="/agent-dashboard">Agent Dashboard</Link></li>
        </ul>
      </nav>
      <button onClick={onLogout} className="mt-4 p-2 bg-red-500 text-white rounded">Logout</button>
    </aside>
  );
}

export default Sidebar;
