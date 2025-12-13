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
import EFOAnalysis from './components/EFOAnalysis'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes: Accessible kahit walang login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Login isForgotPassword={true} />} />

        {/* 🔑 Protected Routes (Kailangan ng Authentication) */}
        {/* Ang ProtectedRoute ang magsasala. Kapag walang auth, ididirekta sa /login. */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Ang path="/" ay ang Dashboard. Ito ang unang makikita kapag naka-login. */}
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/agrowaste" element={<Agrowaste />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/efo-analysis" element={<EFOAnalysis />} /> 
          </Route>
        </Route>

        {/* ❗️ Catch-all/404 Route: Kapag nag-type ang user ng maling URL, ibabalik sila sa root path ("/"). 
            Pagbalik sa "/", che-checkin ulit ng ProtectedRoute kung naka-login sila. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
