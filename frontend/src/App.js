import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Behaviors from "./components/Behaviors";
import Profile from "./components/Profile";
import StudentView from "./components/StudentView";
import Reports from "./components/Reports";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUpdateUser = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onSignUp={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {user.role === 'student' ? (
            <>
              <Route path="/" element={<StudentView user={user} />} />
              <Route path="/profile" element={<Profile user={user} onUpdateUser={handleUpdateUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/students" element={<Students user={user} />} />
              <Route path="/behaviors" element={<Behaviors user={user} />} />
              <Route path="/reports" element={<Reports user={user} />} />
              <Route path="/profile" element={<Profile user={user} onUpdateUser={handleUpdateUser} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
