import React, { useState } from "react";
import "../styles/BudgetCalculator.css";

const BudgetCalculator = () => {
  const [money, setMoney] = useState("");
  const [twentyPercent, setTwentyPercent] = useState(0);
  const [thirtyPercent, setThirtyPercent] = useState(0);
  const [fiftyPercent, setFiftyPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Calculating...");

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(money) || 0;

    setLoading(true);
    setMoney("");

    const messages = [
      "Calculating savings...",
      "Calculating wants...",
      "Calculating needs...",
    ];
    let i = 0;

    // Change text every 800ms while loading
    const textInterval = setInterval(() => {
      setLoadingText(messages[i % messages.length]);
      i++;
    }, 1500);

    const delay = Math.floor(Math.random() * 1000) + 4000;
    setTimeout(() => {
      clearInterval(textInterval);
      setTwentyPercent(amount * 0.2);
      setThirtyPercent(amount * 0.3);
      setFiftyPercent(amount * 0.5);
      setLoading(false);
    }, delay);
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
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      <div className="result-box">
        {loading ? (
          <p className="loading-text">⏳ {loadingText}</p>
        ) : (
          <>
            <p className="result-btn twenty">
              20% (Savings): ₹{twentyPercent.toFixed(2)}
            </p>
            <p className="result-btn thirty">
              30% (Wants): ₹{thirtyPercent.toFixed(2)}
            </p>
            <p className="result-btn fifty">
              50% (Needs): ₹{fiftyPercent.toFixed(2)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetCalculator;
