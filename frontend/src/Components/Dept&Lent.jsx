import React, { useState } from "react";
import "../styles/Dept&Lent.css";

const DeptLent = ({ onClose }) => {
  const [money, setMoney] = useState("");
  const [name, setName] = useState("");
  const [deptMoney, setDeptMoney] = useState(0);
  const [lentMoney, setLentMoney] = useState(0);
  const [action, setAction] = useState("");
  const [records, setRecords] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(money) || 0;

    if (!name.trim() || amount <= 0 || !action) {
      return;
    }

    if (action === "dept") {
      setDeptMoney((prev) => prev + amount);
    } else if (action === "lent") {
      setLentMoney((prev) => prev + amount);
    }

    setRecords([
      ...records,
      {
        name: name.trim(),
        amount,
        type: action,
        date: new Date().toLocaleDateString(),
        id: Date.now(),
      },
    ]);

    setMoney("");
    setName("");
    setAction("");
  };

  const clearRecords = () => {
    setRecords([]);
    setDeptMoney(0);
    setLentMoney(0);
  };

  const deleteRecord = (id) => {
    const record = records.find((rec) => rec.id === id);
    if (record) {
      if (record.type === "dept") {
        setDeptMoney((prev) => prev - record.amount);
      } else {
        setLentMoney((prev) => prev - record.amount);
      }
      setRecords(records.filter((rec) => rec.id !== id));
    }
  };

  return (
    <div className="dept-lent-container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={name}
          className="input"
          placeholder="Enter person's name..."
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          value={money}
          className="input"
          placeholder="Enter the amount..."
          onChange={(e) => setMoney(e.target.value)}
          min="0"
          step="0.01"
          required
        />

        <div className="action-buttons">
          <button
            className={`btn action-btn dept ${
              action === "dept" ? "active" : ""
            }`}
            type="button"
            onClick={() => setAction("dept")}
          >
            💰 Debt
          </button>
          <button
            className={`btn action-btn lent ${
              action === "lent" ? "active" : ""
            }`}
            type="button"
            onClick={() => setAction("lent")}
          >
            📤 Lent
          </button>
        </div>

        <button
          type="submit"
          className="submit-action-btn"
          disabled={!name.trim() || !money || !action}
        >
          Add Record
        </button>
      </form>

      <div className="summary-cards">
        <div className="summary-card dept-card">
          <h3>Total Debt</h3>
          <p className="amount">₹{deptMoney.toFixed(2)}</p>
        </div>
        <div className="summary-card lent-card">
          <h3>Total Lent</h3>
          <p className="amount">₹{lentMoney.toFixed(2)}</p>
        </div>
      </div>

      <div className="records-section">
        <div className="records-header">
          <h3>Records ({records.length})</h3>
          {records.length > 0 && (
            <button className="clear-btn" onClick={clearRecords}>
              Clear All
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="empty-state">
            <p>No records yet</p>
            <small>Add your first debt or lent record above</small>
          </div>
        ) : (
          <div className="records-list">
            {records.map((rec) => (
              <div key={rec.id} className={`record-item ${rec.type}`}>
                <div className="record-info">
                  <span className="record-name">{rec.name}</span>
                  <span className="record-date">{rec.date}</span>
                </div>
                <div className="record-actions">
                  <span className="record-amount">
                    ₹{rec.amount.toFixed(2)}
                  </span>
                  <button
                    className="delete-record-btn"
                    onClick={() => deleteRecord(rec.id)}
                    aria-label="Delete record"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeptLent;
