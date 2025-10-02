import React, { useState, useEffect } from "react";
import "../styles/BudgetCalculator.css";
import DeptLent from "./Dept&Lent";

const BudgetCalculator = () => {
  const [money, setMoney] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Calculating...");
  const [showDeptLent, setShowDeptLent] = useState(false);
  const [panelLoaded, setPanelLoaded] = useState(false);
  const [notHundred, setNotHundred] = useState(false);

  // Budget Ratio
  const [ratio, setRatio] = useState(false);
  const [twentyPercent, setTwentyPercent] = useState(0);
  const [thirtyPercent, setThirtyPercent] = useState(0);
  const [fiftyPercent, setFiftyPercent] = useState(0);
  const [customSavings, setCustomSavings] = useState(20);
  const [customWants, setCustomWants] = useState(30);
  const [customNeeds, setCustomNeeds] = useState(50);

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
      setTwentyPercent((amount * customSavings) / 100);
      setThirtyPercent((amount * customWants) / 100);
      setFiftyPercent((amount * customNeeds) / 100);
      setLoading(false);
    }, delay);
  };

  const toggleDeptLent = () => {
    setShowDeptLent(!showDeptLent);
  };

  // Auto Hide error after a few seconds
  useEffect(() => {
    let timer;
    if (notHundred) {
      timer = setTimeout(() => {
        setNotHundred(false);
      }, 4000); // 4 seconds
    }

    return () => clearTimeout(timer);
  }, [notHundred]);

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
              <span className="result-label">Savings ({customSavings}%):</span>
              <span className="result-amount">₹{twentyPercent.toFixed(2)}</span>
            </div>
            <div className="result-item thirty">
              <span className="result-label">Wants ({customWants}%):</span>
              <span className="result-amount">₹{thirtyPercent.toFixed(2)}</span>
            </div>
            <div className="result-item fifty">
              <span className="result-label">Needs ({customNeeds}%):</span>
              <span className="result-amount">₹{fiftyPercent.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <div className="action-btn-row">
        {/* Set Ratio Button */}
        <button
          className="ratio-btn"
          type="button"
          onClick={() => setRatio(true)}
        >
          Set Ratio
        </button>

        {/* Toggle Button */}
        <button
          type="button"
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
      </div>

      {/* Overlay */}
      <div
        className={`dept-overlay ${showDeptLent ? "active" : ""}`}
        onClick={toggleDeptLent}
      ></div>

      {/* Ratio Modal */}
      {ratio && (
        <>
          <div className="ratio-overlay" onClick={() => setRatio(false)}></div>
          <div className="ratio-modal">
            <h2>Set Budget Ratio</h2>

            {/* Progress Bar */}
            <div
              className={`ratio-progress ${
                customSavings + customWants + customNeeds === 100
                  ? "valid"
                  : "invalid"
              }`}
            >
              <div
                className="ratio-progress-fill"
                style={{
                  width: `${customSavings + customWants + customNeeds}%`,
                }}
              ></div>
            </div>

            <label>
              Savings (%)
              <input
                type="number"
                min="0"
                max="100"
                value={customSavings}
                onChange={(e) => setCustomSavings(Number(e.target.value))}
              />
            </label>
            <label>
              Wants (%)
              <input
                type="number"
                min="0"
                max="100"
                value={customWants}
                onChange={(e) => setCustomWants(Number(e.target.value))}
              />
            </label>
            <label>
              Needs (%)
              <input
                type="number"
                min="0"
                max="100"
                value={customNeeds}
                onChange={(e) => setCustomNeeds(Number(e.target.value))}
              />
            </label>

            {notHundred && (
              <p className="ratio-error">❌ Percentages must add up to 100%</p>
            )}

            <button
              className="ratio-close-btn"
              type="button"
              onClick={() => {
                if (customNeeds + customSavings + customWants !== 100) {
                  setNotHundred(true);
                  return;
                }
                setNotHundred(false);
                setRatio(false);
              }}
            >
              OK
            </button>
          </div>
        </>
      )}

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
