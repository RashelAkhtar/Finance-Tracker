import React, { useState } from "react";
import "../styles/Dept&Lent.css";

const DeptLent = ({ onClose }) => {
  const [money, setMoney] = useState("");
  const [name, setName] = useState("");
  const [deptMoney, setDeptMoney] = useState(0);
  const [lentMoney, setLentMoney] = useState(0);
  const [records, setRecords] = useState([]);

  const addRecord = (type) => {
    const amount = parseFloat(money) || 0;

    if (!name.trim() || amount <= 0) {
      return;
    }

    if (type === "dept") {
      setDeptMoney((prev) => prev + amount);
    } else if (type === "lent") {
      setLentMoney((prev) => prev + amount);
    }

    setRecords((prev) => [
      ...prev,
      {
        name: name.trim(),
        amount,
        type,
        date: new Date().toLocaleDateString(),
        id: Date.now(),
      },
    ]);

    setMoney("");
    setName("");
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
      {/* prevent default form submit */}
      <form onSubmit={(e) => e.preventDefault()} className="form">
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
            className="btn action-btn dept"
            type="button"
            onClick={() => addRecord("dept")}
          >
            💰 Debt
          </button>
          <button
            className="btn action-btn lent"
            type="button"
            onClick={() => addRecord("lent")}
          >
            📤 Lent
          </button>
        </div>
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
