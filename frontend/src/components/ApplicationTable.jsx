import React, { useState } from "react";
import api from "../api";
import { useToast } from "./Toast";
import ConfirmModal from "./ConfirmModal";
import { TrashIcon, DownloadIcon } from "./Icons";

export default function ApplicationTable({ applications, companies, onUpdate }) {
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const perPage = 10;

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      toast("Status updated", "success");
      onUpdate();
    } catch (err) {
      toast("Failed to update", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/applications/${deleteId}`);
      toast("Application deleted", "info");
      setDeleteId(null);
      onUpdate();
    } catch (err) {
      toast("Failed to delete", "error");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/applications/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast("CSV exported", "success");
    } catch (err) {
      toast("Export failed", "error");
    }
  };

  let filtered = applications;
  if (statusFilter) filtered = filtered.filter((a) => a.status === statusFilter);
  if (companyFilter) filtered = filtered.filter((a) => String(a.company_id) === companyFilter);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((a) =>
      a.job_title.toLowerCase().includes(s) || (a.notes && a.notes.toLowerCase().includes(s))
    );
  }

  const totalPages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const hasFilters = statusFilter || companyFilter || search;

  const clearFilters = () => {
    setStatusFilter("");
    setCompanyFilter("");
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <>
      {deleteId && (
        <ConfirmModal
          title="Delete Application"
          message="Are you sure? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ marginBottom: 0 }}>Applications ({filtered.length})</h2>
          {applications.length > 0 && (
            <button className="btn-success btn-sm" onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <DownloadIcon /> Export CSV
            </button>
          )}
        </div>

        {applications.length > 0 && (
          <div className="filters">
            <input
              placeholder="Search jobs or notes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Statuses</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <select value={companyFilter} onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Companies</option>
              {(companies || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {hasFilters && <button className="btn-outline btn-sm" onClick={clearFilters}>Clear</button>}
          </div>
        )}

        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{hasFilters ? "🔍" : "📋"}</div>
            <h3>{hasFilters ? "No matches found" : "No applications yet"}</h3>
            <p>{hasFilters ? "Try adjusting your filters" : "Head to Add New to create your first application"}</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Notes</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 500 }}>{app.job_title}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{app.company?.name}</td>
                      <td>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`status-badge status-${app.status}`}
                          style={{ width: "auto", marginBottom: 0, border: "none", cursor: "pointer", background: "transparent", fontWeight: 600 }}
                        >
                          <option>Applied</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                        {new Date(app.applied_date).toLocaleDateString()}
                      </td>
                      <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                        {app.notes || "—"}
                      </td>
                      <td>
                        <button className="btn-icon btn-danger" onClick={() => setDeleteId(app.id)} title="Delete">
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn-outline btn-sm" disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}>← Prev</button>
                <span>{safePage} / {totalPages}</span>
                <button className="btn-outline btn-sm" disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}