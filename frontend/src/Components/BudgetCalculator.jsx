import React, { useState, useEffect } from "react";
import "../styles/BudgetCalculator.css";
import DeptLent from "./Dept&Lent";

const BudgetCalculator = () => {
  const [money, setMoney] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeptLent, setShowDeptLent] = useState(false);
  const [panelLoaded, setPanelLoaded] = useState(false);
  const [notHundred, setNotHundred] = useState(false);
  const [showRatio, setShowRatio] = useState(false);

  // Budget Ratio
  const [budget, setBudget] = useState({
    savings: 20,
    wants: 30,
    needs: 50,
    savingsAmount: 0,
    wantsAmount: 0,
    needsAmount: 0,
  });

  // Lock background scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = showDeptLent ? "hidden" : "auto";
    if (showDeptLent) {
      setPanelLoaded(true);
    } else {
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

    // time out for the calculating loading animation
    setTimeout(() => {
      setBudget((prev) => ({
        ...prev,
        savingsAmount: (amount * prev.savings) / 100,
        wantsAmount: (amount * prev.wants) / 100,
        needsAmount: (amount * prev.needs) / 100,
      }));
      setLoading(false);
    }, delay);
  };

  // Auto Hide error after a few seconds
  useEffect(() => {
    if (notHundred) {
      const timer = setTimeout(() => {
        setNotHundred(false);
      }, 4000); // 4 seconds
      return () => clearTimeout(timer);
    }
  }, [notHundred]);

  const totalPercentage = budget.savings + budget.wants + budget.needs;

  // to handle the ratio
  const handleRatioSave = () => {
    if (totalPercentage !== 100) {
      setNotHundred(true);
      return;
    }
    setNotHundred(false);
    setShowRatio(false);
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
            <p className="loading-text">⏳ Calculating...</p>
          </div>
        ) : (
          <>
            <div className="result-item twenty">
              <span className="result-label">Savings ({budget.savings}%):</span>
              <span className="result-amount">
                ₹{budget.savingsAmount.toFixed(2)}
              </span>
            </div>
            <div className="result-item thirty">
              <span className="result-label">Wants ({budget.wants}%):</span>
              <span className="result-amount">
                ₹{budget.wantsAmount.toFixed(2)}
              </span>
            </div>
            <div className="result-item fifty">
              <span className="result-label">Needs ({budget.needs}%):</span>
              <span className="result-amount">
                ₹{budget.needsAmount.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="action-btn-row">
        {/* Set Ratio Button */}
        <button
          className="ratio-btn"
          type="button"
          onClick={() => setShowRatio(true)}
        >
          Set Ratio
        </button>

        {/* Toggle Button */}
        <button
          type="button"
          className={`dept-toggle-btn ${showDeptLent ? "active" : ""}`}
          onClick={() => setShowDeptLent(!showDeptLent)}
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
        onClick={() => setShowDeptLent(false)}
      ></div>

      {/* Ratio Modal */}
      {showRatio && (
        <>
          <div
            className="ratio-overlay"
            onClick={() => setShowRatio(false)}
          ></div>
          <div className="ratio-modal">
            <h2>Set Budget Ratio</h2>

            {/* Progress Bar */}
            <div
              className={`ratio-progress ${
                totalPercentage === 100 ? "valid" : "invalid"
              }`}
            >
              <div
                className="ratio-progress-fill"
                style={{
                  width: `${totalPercentage}%`,
                }}
              ></div>
            </div>

            {["savings", "wants", "needs"].map((category) => (
              <label key={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)} (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={budget[category]}
                  onChange={(e) =>
                    setBudget((prev) => ({
                      ...prev,
                      [category]: Number(e.target.value),
                    }))
                  }
                />
              </label>
            ))}

            {notHundred && (
              <p className="ratio-error">❌ Percentages must add up to 100%</p>
            )}

            <button className="ratio-close-btn" onClick={handleRatioSave}>
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
                onClick={() => setShowDeptLent(false)}
              >
                &times;
              </button>
            </div>
            <DeptLent onClose={() => setShowDeptLent(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCalculator;
