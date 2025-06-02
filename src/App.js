import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/CustomerDashboard';
import AgentDashboard from './components/AgentDashboard';
import TicketDetails from './components/TicketDetails';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdminPanel from './components/AdminPanel';
import Reports from './components/Reports';
import logo from './logo.svg';
import './App.css';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

// Attach token to Authorization headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      if (user.role === 'customer') {
        navigate('/customer-dashboard');
      } else if (user.role === 'agent') {
        navigate('/agent-dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
