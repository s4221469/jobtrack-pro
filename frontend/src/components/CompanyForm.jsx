import React, { useState } from "react";
import api from "../api";
import { useToast } from "./Toast";

export default function CompanyForm({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api.post("/companies/", { name });
      setName("");
      toast("Company added", "success");
      onCreated();
    } catch (err) {
      toast("Failed to add company", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add Company</h2>
      <div>
        <label>Company Name</label>
        <input placeholder="e.g. Google, Amazon..." value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Company"}
        </button>
      </div>
    </div>
  );
}