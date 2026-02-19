import React, { useState } from "react";
import api from "../api";
import { useToast } from "./Toast";

export default function ApplicationForm({ companies, onCreated }) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !companyId) return;
    setLoading(true);
    try {
      await api.post("/applications/", {
        job_title: jobTitle,
        company_id: parseInt(companyId),
        status,
        notes,
      });
      setJobTitle("");
      setCompanyId("");
      setStatus("Applied");
      setNotes("");
      toast("Application added!", "success");
      onCreated();
    } catch (err) {
      toast("Failed to add application", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add Application</h2>
      <div>
        <label>Job Title</label>
        <input placeholder="e.g. Frontend Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        <label>Company</label>
        <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
          <option value="">Select a company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <label>Notes</label>
        <textarea placeholder="Any notes about this application..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        <button className="btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Application"}
        </button>
      </div>
    </div>
  );
}