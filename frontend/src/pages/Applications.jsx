import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ApplicationTable from "../components/ApplicationTable";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const [appRes, compRes] = await Promise.all([
        api.get("/applications/"),
        api.get("/companies/"),
      ]);
      const data = appRes.data;
      setApplications(data.items || data);
      setCompanies(compRes.data);
    } catch (err) {
      console.error("Failed to load", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p className="page-subtitle">{applications.length} total application{applications.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/add")}>+ New Application</button>
      </div>
      <ApplicationTable applications={applications} companies={companies} onUpdate={load} />
    </div>
  );
}