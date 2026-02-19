import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useToast } from "../components/Toast";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      toast("Welcome back!", "success");
      onLogin(res.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="sidebar-brand-icon" style={{ margin: "0 auto 16px", width: 48, height: 48, fontSize: 18 }}>JT</div>
          <div className="auth-title">Welcome back</div>
          <div className="auth-subtitle">Sign in to your JobTrack account</div>
        </div>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: 4 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}