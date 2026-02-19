import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";

const COLORS = {
  Applied: "#60a5fa",
  Interview: "#fbbf24",
  Offer: "#34d399",
  Rejected: "#f87171",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", fontSize: 13 }}>
      <span style={{ fontWeight: 600 }}>{payload[0].name || payload[0].payload?.status}: </span>
      <span style={{ fontFamily: "var(--font-mono)" }}>{payload[0].value}</span>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="spinner" />;
  if (!stats) return <div className="empty-state"><p>Failed to load dashboard.</p></div>;

  const pieData = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ].filter((d) => d.value > 0);

  const barData = [
    { status: "Applied", count: stats.applied, fill: COLORS.Applied },
    { status: "Interview", count: stats.interview, fill: COLORS.Interview },
    { status: "Offer", count: stats.offer, fill: COLORS.Offer },
    { status: "Rejected", count: stats.rejected, fill: COLORS.Rejected },
  ];

  const formatTime = (dateStr) => {
    const d = new Date(dateStr + "Z"); // ensure UTC
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return "now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  };

  const activity = stats.recent_activity || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Your job search at a glance</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/add")}>+ New Application</button>
      </div>

      <div className="stats-grid">
        {[
          { label: "Total", value: stats.total, color: "var(--accent)", bg: "var(--accent-glow)", icon: "📊" },
          { label: "Applied", value: stats.applied, color: COLORS.Applied, bg: "var(--info-bg)", icon: "📤" },
          { label: "Interview", value: stats.interview, color: COLORS.Interview, bg: "var(--warning-bg)", icon: "💬" },
          { label: "Offers", value: stats.offer, color: COLORS.Offer, bg: "var(--success-bg)", icon: "🎉" },
          { label: "Rejected", value: stats.rejected, color: COLORS.Rejected, bg: "var(--danger-bg)", icon: "✕" },
          { label: "Conversion", value: `${stats.conversion_rate}%`, color: "var(--accent)", bg: "var(--accent-glow)", icon: "📈" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="grid-2">
          <div className="card">
            <h2>Status Distribution</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11 }}>
                    {pieData.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h2>By Status</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="status" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((entry) => <Cell key={entry.status} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <h2>Recent Applications</h2>
          {stats.recent.length > 0 ? (
            <>
              <table>
                <thead><tr><th>Position</th><th>Company</th><th>Status</th></tr></thead>
                <tbody>
                  {stats.recent.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 500 }}>{app.job_title}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{app.company?.name}</td>
                      <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stats.total > 5 && (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <button className="btn-outline btn-sm" onClick={() => navigate("/applications")}>View all →</button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Add your first application to get started</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Activity Log</h2>
          {activity.length > 0 ? (
            <ul className="activity-list">
              {activity.map((a) => (
                <li key={a.id} className="activity-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="activity-job">{a.job_title}</span>
                    <span className="activity-company"> at {a.company_name}</span>
                  </div>
                  <span className={`status-badge status-${a.old_status}`} style={{ fontSize: 10, padding: "2px 8px" }}>{a.old_status}</span>
                  <span className="activity-arrow">→</span>
                  <span className={`status-badge status-${a.new_status}`} style={{ fontSize: 10, padding: "2px 8px" }}>{a.new_status}</span>
                  <span className="activity-time">{formatTime(a.changed_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⏱</div>
              <h3>No activity yet</h3>
              <p>Status changes will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}