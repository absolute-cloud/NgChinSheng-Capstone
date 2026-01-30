import React, { useState } from 'react'
import './FinanceDashboard.css'

export default function FinanceDashboard() {
  const [stocks, setStocks] = useState([])
  const [status, setStatus] = useState('No stocks added yet')
  const [name, setName] = useState('AAPL')
  const [qty, setQty] = useState(2)
  const [value, setValue] = useState('123.99')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name) return
    const newStock = { id: Date.now(), name, qty: Number(qty), value: Number(value) }
    setStocks((prev) => [...prev, newStock])
    setStatus(`Added ${name} — ${qty} shares @ ${value}`)
  }

  return (
    <main>
      <h3 className="dashboard_title">Finance Dashboard</h3>

      <form className="stock_row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="stock_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="stock_qty"
          value={qty}
          min="0"
          onChange={(e) => setQty(e.target.value)}
        />
        <input
          type="text"
          className="stock_value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
            {s.name} — {s.qty} @ {s.value}
          </li>
        ))}
      </ul>
    </main>
  )
}
