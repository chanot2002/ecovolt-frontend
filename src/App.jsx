import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Agrowaste from './components/Agrowaste';
import Settings from './components/Settings';
import Reports from './components/Reports';
// ➡️ Import ng EFOAnalysis Component
import EFOAnalysis from './components/EFOAnalysis'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Login isForgotPassword={true} />} />

        {/* Protected Routes (Require Auth) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agrowaste" element={<Agrowaste />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            
            {/* ➡️ Dito na ang iyong EFO Analysis Page */}
            <Route path="/efo-analysis" element={<EFOAnalysis />} /> 
            
          </Route>
        </Route>

        {/* Fallback/Home Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;