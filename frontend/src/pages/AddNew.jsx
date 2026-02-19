import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CompanyForm from "../components/CompanyForm";
import ApplicationForm from "../components/ApplicationForm";

export default function AddNew() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  const loadCompanies = useCallback(async () => {
    try {
      const res = await api.get("/companies/");
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to load companies", err);
    }
  }, []);

  useEffect(() => { loadCompanies(); }, [loadCompanies]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add New</h1>
          <p className="page-subtitle">Add a company first, then create an application</p>
        </div>
      </div>

      <div className="grid-2">
        <CompanyForm onCreated={loadCompanies} />
        <ApplicationForm companies={companies} onCreated={() => navigate("/applications")} />
      </div>

      {companies.length > 0 && (
        <div className="card">
          <h2>Your Companies ({companies.length})</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {companies.map((c) => (
              <span key={c.id} className="status-badge" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>{c.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}