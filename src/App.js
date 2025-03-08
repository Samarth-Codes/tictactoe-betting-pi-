import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import TicTacToe from "./Tictactoe/Tictactoe";
import { authenticateWithPi } from './pi/piAuth'; // Corrected import
import "./styles/App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authenticate user with Pi Network on app load
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const userData = await authenticateWithPi();
        setUser(userData);
      } catch (error) {
        console.error("Authentication failed:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, []);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    
      <div>
        {user && (
          <div className="navbar">
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to={user ? "/game" : "/login"} />} />
          <Route path="/login" element={user ? <Navigate to="/game" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/game" /> : <Signup />} />
          <Route 
            path="/game" 
            element={user ? <TicTacToe user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    
  );
};

export default App;
