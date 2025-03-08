import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateWithPi } from "../../pi/piAuth";

import "../../styles/Login.css";
import "../../styles/PiAuth.css";

const Login = () => {
  const [authStatus, setAuthStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [sdkAvailable, setSdkAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check if Pi Network SDK is available
    const checkSdk = () => {
      const available = typeof window.Pi !== "undefined"; // Checks if SDK is loaded
      setSdkAvailable(available);
      return available;
    };

    // Check immediately
    if (!checkSdk()) {
      // Retry after a short delay to ensure SDK has time to load
      const timer = setTimeout(() => {
        checkSdk();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handlePiLogin = async () => {
    try {
      setAuthStatus("authenticating");
      setError(null);

      await authenticateWithPi();

      // Redirect to the game on successful authentication
      navigate("/game");
    } catch (err) {
      setAuthStatus("failed");
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthStatus("idle");
    }
  };

  return (
    <div className="login-container pi-auth-container">
      <h1 className="login-title">Tic Tac Toe Betting Game</h1>
      <div className="login-card auth-card">
        <h2>Login with Pi Network</h2>
        <p>Access your account using your Pi Network wallet</p>

        <button
          className="login-button pi-auth-button"
          onClick={handlePiLogin}
          disabled={authStatus === "authenticating" || !sdkAvailable}
        >
          {authStatus === "authenticating" ? "Connecting..." : "Connect with Pi Network"}
        </button>

        {error && <p className="auth-error">{error}</p>}

        {!sdkAvailable && (
          <div className="auth-warning">
            <p>Pi Network SDK not detected. Please open this app in the Pi Browser.</p>
          </div>
        )}

        <div className="auth-links">
          <p>
            Don't have a Pi account?{" "}
            <a href="https://minepi.com/" target="_blank" rel="noopener noreferrer">
              Get Pi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
