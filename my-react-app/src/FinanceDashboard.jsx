import React, { useState } from "react";
import "./FinanceDashboard.css";

export default function FinanceDashboard() {
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState("No stocks added yet");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Error handling for empty inputs
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

    // clear inputs after submission
    setName("");
    setQty("");
    setValue("");
  }

  return (
    <main>
      <h3 className="dashboard_title">Financee Dashboard</h3>

      <form className="stock_row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="stock_name"
          placeholder="E.g. AAPL"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="stock_qty"
          placeholder="Quantity"
          min="1" // enforce at least 1 share
          step="1" // restrict to integers only
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <input
          type="text"
          className="stock_value"
          placeholder="Value"
          value={value}
          onChange={(e) => {
            // restrict to numbers and one decimal point
            let v = e.target.value.replace(/[^0-9.]/g, "");
            const parts = v.split(".");
            if (parts.length > 2) {
              v = parts[0] + "." + parts.slice(1).join("");
            }
            setValue(v);
          }}
          onBlur={() => {
            // format to 2 decimal places when leaving the field
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
