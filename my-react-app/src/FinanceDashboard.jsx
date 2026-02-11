import React, { useState, useRef } from "react";
import "./FinanceDashboard.css";

export default function FinanceDashboard() {
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState("No stocks added yet");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debounceTimer = useRef(null);

  // Fetch ticker suggestions via CORS Proxy (corsproxy.io)
  async function fetchSuggestions(query) {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          "https://query1.finance.yahoo.com/v1/finance/search?q=" + query,
        )}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Yahoo via CORS Proxy:", data);
      setSuggestions(data.quotes || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setStatus("Error fetching data. Please try again later.");
      setSuggestions([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !qty || !value) {
      setStatus("Please fill in all fields before submitting!");
      return;
    }

    const newStock = {
      id: Date.now(),
      name,
      qty: Number(qty),
      value: Number(value),
    };

    setStocks((prev) => [...prev, newStock]);
    setStatus(`Added ${name} — ${qty} shares @ ${Number(value).toFixed(2)}`);

    setName("");
    setQty("");
    setValue("");
    setSuggestions([]);
  }

  return (
    <main>
      <h3 className="dashboard_title">Finance Dashboard</h3>

      <form className="stock_row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="stock_name"
          placeholder="E.g. AAPL"
          value={name}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setName(val);

            // Debounce API call
            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
              fetchSuggestions(val);
            }, 300);
          }}
          onBlur={(e) => {
            const ticker = e.target.value.toUpperCase().trim();
            if (ticker) {
              const valid = suggestions.some(
                (s) => s.symbol.toUpperCase().trim() === ticker,
              );
              setStatus(
                valid
                  ? "Ticker symbol is valid."
                  : "Invalid ticker symbol. Please check the code.",
              );
            }
          }}
        />

        {suggestions.length > 0 && (
          <ul className="suggestions_dropdown">
            {suggestions.map((s) => (
              <li
                key={s.symbol}
                onClick={() => {
                  setName(s.symbol);
                  setSuggestions([]);
                  setStatus(
                    `Selected ${s.symbol} - ${s.shortname || s.longname}`,
                  );
                }}
              >
                {s.symbol} — {s.shortname || s.longname}
              </li>
            ))}
          </ul>
        )}

        <input
          type="number"
          className="stock_qty"
          placeholder="Quantity"
          min="1"
          step="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <input
          type="text"
          className="stock_value"
          placeholder="Value"
          value={value}
          onChange={(e) => {
            let v = e.target.value.replace(/[^0-9.]/g, "");
            const parts = v.split(".");
            if (parts.length > 2) {
              v = parts[0] + "." + parts.slice(1).join("");
            }
            setValue(v);
          }}
          onBlur={() => {
            if (value) {
              setValue(parseFloat(value).toFixed(2));
            }
          }}
        />
        <button type="submit" className="add_stock">
          Add Stock
        </button>
      </form>

      <div className="stock_list">Stock List</div>
      <div className="stock_append_status">{status}</div>

      <ul className="stock_entries">
        {stocks.map((s) => (
          <li key={s.id} className="stock_entry">
            {s.name} — {s.qty} @ {s.value.toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}
