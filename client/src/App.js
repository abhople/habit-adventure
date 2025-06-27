import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import HabitList from './components/habits/HabitList';
import CreateHabit from './components/habits/CreateHabit';
import Character from './components/character/Character';
import Equipment from './components/character/Equipment';
import Achievements from './components/achievements/Achievements';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-adventure-gradient">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/habits" 
          element={isAuthenticated ? <HabitList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/habits/create" 
          element={isAuthenticated ? <CreateHabit /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/character" 
          element={isAuthenticated ? <Character /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/equipment" 
          element={isAuthenticated ? <Equipment /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/achievements" 
          element={isAuthenticated ? <Achievements /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  );
}

export default App; 