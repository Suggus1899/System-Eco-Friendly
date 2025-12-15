import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Centers from './pages/Centers';
import Schedules from './pages/Schedules';
import Challenges from './pages/Challenges';
import Sidebar from './components/Sidebar';

import './styles/App.css';

function PrivateRoute({ children }) {
  return authService.isAuthenticated() && authService.isAdmin() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/materials" element={<Materials />} />
                    <Route path="/centers" element={<Centers />} />
                    <Route path="/schedules" element={<Schedules />} />
                    <Route path="/challenges" element={<Challenges />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
