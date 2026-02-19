import React from "react";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn-danger btn-sm" onClick={onConfirm} style={{ background: "var(--danger)", color: "#fff" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}