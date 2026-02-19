import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import AddNew from "./pages/AddNew";
import { ToastProvider } from "./components/Toast";
import { DashboardIcon, BriefcaseIcon, PlusIcon, LogoutIcon, MenuIcon } from "./components/Icons";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const closeSidebar = () => setSidebarOpen(false);

  if (!token) {
    return (
      <Router>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </ToastProvider>
      </Router>
    );
  }

  return (
    <Router>
      <ToastProvider>
        <div className="app-layout">
          <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={closeSidebar} />
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <Link to="/" className="sidebar-brand" onClick={closeSidebar}>
              <div className="sidebar-brand-icon">JT</div>
              <span className="sidebar-brand-text">JobTrack</span>
              <span className="sidebar-brand-badge">Pro</span>
            </Link>
            <nav className="sidebar-nav">
              <NavLink to="/" end className="sidebar-link" onClick={closeSidebar}>
                <DashboardIcon /> Dashboard
              </NavLink>
              <NavLink to="/applications" className="sidebar-link" onClick={closeSidebar}>
                <BriefcaseIcon /> Applications
              </NavLink>
              <NavLink to="/add" className="sidebar-link" onClick={closeSidebar}>
                <PlusIcon /> Add New
              </NavLink>
            </nav>
            <div className="sidebar-footer">
              <button className="sidebar-logout" onClick={() => { logout(); closeSidebar(); }}>
                <LogoutIcon /> Sign Out
              </button>
            </div>
          </aside>

          <div className="mobile-header">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuIcon />
            </button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>JobTrack Pro</span>
            <div style={{ width: 40 }} />
          </div>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/add" element={<AddNew />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;