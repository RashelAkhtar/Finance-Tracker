import React, { useState, useEffect } from "react";
import "../styles/BudgetCalculator.css";
import DeptLent from "./Dept&Lent";

const BudgetCalculator = () => {
  const [money, setMoney] = useState("");
  const [twentyPercent, setTwentyPercent] = useState(0);
  const [thirtyPercent, setThirtyPercent] = useState(0);
  const [fiftyPercent, setFiftyPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Calculating...");
  const [showDeptLent, setShowDeptLent] = useState(false);
  const [panelLoaded, setPanelLoaded] = useState(false);

  // Lock background scroll when panel is open
  useEffect(() => {
    if (showDeptLent) {
      document.body.style.overflow = "hidden";
      setPanelLoaded(true);
    } else {
      document.body.style.overflow = "auto";
      const timer = setTimeout(() => setPanelLoaded(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showDeptLent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(money) || 0;

    if (amount <= 0) return;

    setLoading(true);
    setMoney("");

    const delay = Math.floor(Math.random() * 1000) + 2000;
    setTimeout(() => {
      setTwentyPercent(amount * 0.2);
      setThirtyPercent(amount * 0.3);
      setFiftyPercent(amount * 0.5);
      setLoading(false);
    }, delay);
  };

  const toggleDeptLent = () => {
    setShowDeptLent(!showDeptLent);
  };

  return (
    <div className="budget-container">
      <form className="budget-form" onSubmit={handleSubmit}>
        <h1 className="title">Budget Calculator</h1>

        <input
          type="number"
          className="money-input"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
          placeholder="Enter the money..."
          min="0"
          step="0.01"
        />

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || !money || parseFloat(money) <= 0}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner"></span>
              Calculating...
            </span>
          ) : (
            "Calculate"
          )}
        </button>
      </form>

      <div className="result-box">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">⏳ {loadingText}</p>
          </div>
        ) : (
          <>
            <div className="result-item twenty">
              <span className="result-label">20% (Savings)</span>
              <span className="result-amount">₹{twentyPercent.toFixed(2)}</span>
            </div>
            <div className="result-item thirty">
              <span className="result-label">30% (Wants)</span>
              <span className="result-amount">₹{thirtyPercent.toFixed(2)}</span>
            </div>
            <div className="result-item fifty">
              <span className="result-label">50% (Needs)</span>
              <span className="result-amount">₹{fiftyPercent.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <button
        className={`dept-toggle-btn ${showDeptLent ? "active" : ""}`}
        onClick={toggleDeptLent}
        aria-expanded={showDeptLent}
        aria-label={showDeptLent ? "Close Debt & Lent" : "Open Debt & Lent"}
      >
        <span className="btn-icon">{showDeptLent ? "←" : "💸"}</span>
        <span className="btn-text">
          {showDeptLent ? "Close" : "Debt & Lent"}
        </span>
      </button>

      {/* Overlay */}
      <div
        className={`dept-overlay ${showDeptLent ? "active" : ""}`}
        onClick={toggleDeptLent}
      ></div>

      {/* Slide-in Panel */}
      <div className={`dept-panel ${showDeptLent ? "open" : ""}`}>
        {panelLoaded && (
          <div className="panel-content">
            <div className="panel-header">
              <h2>Debt & Lent Manager</h2>
              <button
                className="close-panel-btn"
                onClick={toggleDeptLent}
                aria-label="Close Debt & Lent"
                type="button"
              >
                &times;
              </button>
            </div>
            <DeptLent onClose={toggleDeptLent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCalculator;
