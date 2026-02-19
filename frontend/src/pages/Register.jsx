import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useToast } from "../components/Toast";

export default function Register({ onLogin }) {
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
      await api.post("/users/register", { email, password });
      const res = await api.post("/users/login", { email, password });
      toast("Account created!", "success");
      onLogin(res.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="sidebar-brand-icon" style={{ margin: "0 auto 16px", width: 48, height: 48, fontSize: 18 }}>JT</div>
          <div className="auth-title">Create account</div>
          <div className="auth-subtitle">Start tracking your job applications</div>
        </div>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: 4 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}