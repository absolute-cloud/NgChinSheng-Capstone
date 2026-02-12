import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  createContext,
} from "react";
import "./FinanceDashboard.css";

const StockContext = createContext();

export default function FinanceDashboard() {
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState("No stocks added yet");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [indices, setIndices] = useState([
    { name: "S&P 500", symbol: "^GSPC", value: 0, change: 0 },
    { name: "Nasdaq", symbol: "^IXIC", value: 0, change: 0 },
    { name: "Dow Jones", symbol: "^DJI", value: 0, change: 0 },
    { name: "VIX", symbol: "^VIX", value: 0, change: 0 },
  ]);

  const debounceTimer = useRef(null);

  async function fetchSuggestions(query) {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          "https://query1.finance.yahoo.com/v1/finance/search?q=" + query
        )}`
      );
      if (!response.ok) {
        setSuggestions([]);
        return;
      }
      const data = await response.json();
      setSuggestions(data.quotes || []);
    } catch (error) {
      console.error('Suggestion fetch error:', error);
      setSuggestions([]);
    }
  }

  async function fetchLivePrice(symbol) {
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
        )}`
      );
      const data = await response.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return null;

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const price = currentPrice || previousClose;

      return { price, previousClose };
    } catch (error) {
      console.error('Price fetch error:', error);
      return null;
    }
  }

  async function fetchLiveIndex(symbol) {
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
        )}`
      );
      const data = await response.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return null;

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = Number(((currentPrice - previousClose) / previousClose * 100).toFixed(2));

      return { value: currentPrice, change };
    } catch {
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !qty || !value) {
      setStatus("Please fill in all fields before submitting!");
      return;
    }

    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          "https://query1.finance.yahoo.com/v1/finance/search?q=" + name
        )}`
      );
      if (!response.ok) {
        setStatus("API rate limited. Please try again later.");
        return;
      }
      const data = await response.json();
      const valid = data.quotes?.some(
        (s) => s.symbol.toUpperCase().trim() === name.toUpperCase().trim()
      );
      if (!valid) {
        setStatus("Invalid ticker symbol. Please check the code.");
        return;
      }
    } catch (error) {
      console.error('Validation error:', error);
      setStatus("Error validating ticker.");
      return;
    }

    const liveData = await fetchLivePrice(name);
    if (!liveData) {
      setStatus("Could not fetch live price. Please try again later.");
      return;
    }

    const { price, previousClose } = liveData;
    const purchaseTotal = Number(qty) * Number(value);
    const currentTotal = Number(qty) * price;
    const net = currentTotal - purchaseTotal;

    const newStock = {
      id: Date.now() + Math.random(),
      name,
      qty: Number(qty),
      value: Number(value),
      livePrice: price,
      previousClose: previousClose || price,
      net,
    };

    setStocks((prev) => [...prev, newStock]);
    setName("");
    setQty("");
    setValue("");
    setSuggestions([]);
  }

  const calculateOverallNet = () => {
    return stocks.reduce((acc, stock) => acc + stock.net, 0);
  };

  const calculatePortfolioMetrics = () => {
    const totalInvested = stocks.reduce((acc, stock) => acc + (stock.qty * stock.value), 0);
    const totalCurrentValue = stocks.reduce((acc, stock) => acc + (stock.qty * stock.livePrice), 0);
    const totalNet = calculateOverallNet();
    const percentReturn = totalInvested > 0 ? ((totalNet / totalInvested) * 100).toFixed(2) : 0;
    const totalGains = stocks.filter(s => s.net > 0).reduce((acc, stock) => acc + stock.net, 0);
    const totalLosses = stocks.filter(s => s.net < 0).reduce((acc, stock) => acc + Math.abs(stock.net), 0);
    
    return {
      totalInvested: totalInvested.toFixed(2),
      totalCurrentValue: totalCurrentValue.toFixed(2),
      totalNet: totalNet.toFixed(2),
      percentReturn,
      totalGains: totalGains.toFixed(2),
      totalLosses: totalLosses.toFixed(2),
      numStocks: stocks.length,
    };
  };

  const overallNet = calculateOverallNet();
  const metrics = calculatePortfolioMetrics();

  const refreshPrices = useCallback(async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (s) => {
        try {
          const response = await fetch(
            `https://corsproxy.io/?url=${encodeURIComponent(
              `https://query1.finance.yahoo.com/v8/finance/chart/${s.name}`
            )}`
          );
          const data = await response.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta) return s;

          const currentPrice = meta.regularMarketPrice;
          const previousClose = meta.previousClose;
          const price = currentPrice || previousClose;

          const purchaseTotal = s.qty * s.value;
          const currentTotal = s.qty * price;
          const net = currentTotal - purchaseTotal;

          return { ...s, livePrice: price, previousClose, net };
        } catch {
          return s;
        }
      })
    );
    setStocks(updatedStocks);
  }, [stocks]);

  const refreshIndices = useCallback(async () => {
    const updatedIndices = await Promise.all(
      indices.map(async (idx) => {
        const liveData = await fetchLiveIndex(idx.symbol);
        if (liveData) {
          return { ...idx, value: liveData.value, change: liveData.change };
        }
        return idx;
      })
    );
    setIndices(updatedIndices);
  }, [indices]);

  useEffect(() => {
    if (stocks.length === 0) return;
    const interval = setInterval(() => {
      refreshPrices();
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshPrices]);

  useEffect(() => {
    refreshIndices();
    const interval = setInterval(() => {
      refreshIndices();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshIndices]);

  return (
    <StockContext.Provider value={{ stocks, setStocks, indices, setIndices }}>

      {/* Hero Section */}
      <header className="hero_section">
        <h1>Portfolio Performance at a Glance</h1>
        <p>Track live prices, monitor profit & loss, and stay ahead of the market.</p>
      </header>

      <div className="dashboard_container">
        <h3 className="dashboard_title">📊 Portfolio Dashboard</h3>

        {/* Portfolio Summary Section */}
        {stocks.length > 0 && (
          <section className="portfolio_summary">
            <div className="summary_grid">
              <div className="summary_card">
                <div className="summary_label">Portfolio Value</div>
                <div className="summary_value">${metrics.totalCurrentValue}</div>
                <div className="summary_subtext">Current Market Value</div>
              </div>
              <div className="summary_card">
                <div className="summary_label">Total Invested</div>
                <div className="summary_value">${metrics.totalInvested}</div>
                <div className="summary_subtext">Cost Basis</div>
              </div>
              <div className="summary_card">
                <div className="summary_label">Total Return</div>
                <div className={`summary_value ${overallNet >= 0 ? "profit" : "loss"}`}>
                  {overallNet >= 0 ? "+" : ""}
                  ${metrics.totalNet}
                </div>
                <div className="summary_subtext">{metrics.percentReturn}% Return</div>
              </div>
              <div className="summary_card">
                <div className="summary_label">Holdings</div>
                <div className="summary_value">{metrics.numStocks}</div>
                <div className="summary_subtext">Stocks in Portfolio</div>
              </div>
            </div>
          </section>
        )}

        {/* Performance Metrics */}
        {stocks.length > 0 && (
          <section className="performance_metrics">
            <div className="metrics_grid">
              <div className="metric_item">
                <span className="metric_label">Total Gains</span>
                <span className="metric_value profit_text">${metrics.totalGains}</span>
              </div>
              <div className="metric_item">
                <span className="metric_label">Total Losses</span>
                <span className="metric_value loss_text">-${metrics.totalLosses}</span>
              </div>
              <div className="metric_item">
                <span className="metric_label">Win Rate</span>
                <span className="metric_value">
                  {metrics.numStocks > 0
                    ? (
                        (stocks.filter((s) => s.net > 0).length /
                          metrics.numStocks) *
                        100
                      ).toFixed(0)
                    : 0}%
                </span>
              </div>
            </div>
          </section>
        )}

        <section id="stocks" className="section_card add_stock_section">
          <h4 className="section_subtitle">➕ Add New Position</h4>
          <form className="stock_row" onSubmit={handleSubmit}>
            <div className="stock_name_wrapper">
              <input
                type="text"
                className="stock_name"
                placeholder="E.g. AAPL"
                value={name}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setName(val);
                  if (debounceTimer.current) clearTimeout(debounceTimer.current);
                  debounceTimer.current = setTimeout(() => {
                    fetchSuggestions(val);
                  }, 300);
                }}
                onBlur={async (e) => {
                  const ticker = e.target.value.toUpperCase().trim();
                  if (!ticker) return;
                  try {
                    const response = await fetch(
                      `https://corsproxy.io/?url=${encodeURIComponent(
                        "https://query1.finance.yahoo.com/v1/finance/search?q=" +
                          ticker
                      )}`
                    );
                    const data = await response.json();
                    const valid = data.quotes?.some(
                      (s) => s.symbol.toUpperCase().trim() === ticker
                    );
                    setStatus(
                      valid
                        ? "Ticker symbol is valid."
                        : "Invalid ticker symbol. Please check the code."
                    );
                  } catch {
                    setStatus("Error validating ticker.");
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
                          `Selected ${s.symbol} - ${s.shortname || s.longname}`
                        );
                      }}
                    >
                      {s.symbol} — {s.shortname || s.longname}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="number"
              className="stock_qty"
              placeholder="Quantity"
              min="1"
              step="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              onFocus={() => setSuggestions([])}
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
                if (value) setValue(parseFloat(value).toFixed(2));
              }}
              onFocus={() => setSuggestions([])}
            />
            <button type="submit" className="add_stock">Add Stock</button>
          </form>
          <div className="stock_append_status">{status}</div>
        </section>

        {stocks.length > 0 && (
          <section className="section_card holdings_section">
            <div className="stock_list">📈 Current Holdings</div>
            <StockList />
          </section>
        )}

        {stocks.length > 0 && (
          <section id="market" className="section_card">
            <MarketInfo />
          </section>
        )}
      </div>
    </StockContext.Provider>
  );
}

function StockList() {
  const { stocks } = useContext(StockContext);
  return (
    <ul className="stock_entries">
      {stocks.map((s) => {
        let profitClass = "neutral";
        if (s.net > 0) profitClass = "profit";
        else if (s.net < 0) profitClass = "loss";
        
        // Simulate bid/ask spread (bid is slightly lower, ask is slightly higher)
        const bid = (s.livePrice * 0.995).toFixed(2);
        const ask = (s.livePrice * 1.005).toFixed(2);
        
        return (
          <li key={s.id} className="stock_entry">
            <div className="stock_entry_row">
              <div className="stock_entry_item">
                <span className="stock_entry_label">Symbol:</span>
                <span className="stock_entry_value">{s.name}</span>
              </div>
              <div className="stock_entry_item">
                <span className="stock_entry_label">Qty:</span>
                <span className="stock_entry_value">{s.qty}</span>
              </div>
            </div>
            
            <div className="bid_ask_section">
              <div className="bid_ask_item bid">
                <div className="bid_ask_label">Bid</div>
                <div className="bid_ask_value">${bid}</div>
              </div>
              <div className="bid_ask_item ask">
                <div className="bid_ask_label">Ask</div>
                <div className="bid_ask_value">${ask}</div>
              </div>
            </div>
            
            <div className="stock_entry_row" style={{marginTop: '0.5rem'}}>
              <div className="stock_entry_item">
                <span className="stock_entry_label">Last Done:</span>
                <span className="stock_entry_value current_price">${s.previousClose?.toFixed(2)}</span>
              </div>
              <div className="stock_entry_item">
                <span className="stock_entry_label">Entry:</span>
                <span className="stock_entry_value entry_price">${s.value.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="stock_entry_item" style={{marginTop: '0.5rem', borderColor: '#45a29e'}}>
              <span className="stock_entry_label">P/L:</span>
              <span className={`stock_entry_value pl_value ${profitClass}`}>
                {s.net >= 0 ? "+" : ""}{s.net.toFixed(2)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function MarketInfo() {
  const { indices } = useContext(StockContext);
  const now = new Date();
  const usTime = new Date(
    now.toLocaleString("en-GB", { timeZone: "America/New_York" })
  );
  const sgTime = new Date(
    now.toLocaleString("en-GB", { timeZone: "Asia/Singapore" })
  );

  const marketOpen = new Date(usTime);
  marketOpen.setHours(9, 30, 0, 0);
  const marketClose = new Date(usTime);
  marketClose.setHours(16, 0, 0, 0);

  let marketStatus = "Closed";
  let timeToOpen = null;

  if (usTime >= marketOpen && usTime <= marketClose) {
    marketStatus = "Open";
  } else if (usTime < marketOpen) {
    const diffMs = marketOpen - usTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMin = Math.floor((diffMs / (1000 * 60)) % 60);
    timeToOpen = `${diffHrs} hrs ${diffMin} mins`;
  }

  return (
    <div className="market_info">
      <div style={{ marginBottom: '1rem' }}>
        <strong>Market Status:</strong> {marketStatus}
        {timeToOpen && ` (opens in ${timeToOpen})`}
        <br />
        <strong>US Time:</strong> {usTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} EST
        <br />
        <strong>SG Time:</strong> {sgTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} SGT
      </div>

      <div className="market_indices">
        {indices.map((idx) => (
          <div key={idx.symbol} className="market_index_card">
            <div className="market_index_name">{idx.name}</div>
            <div className="market_index_value">{idx.value.toFixed(2)}</div>
            <div className={`market_index_change ${idx.change >= 0 ? 'positive' : 'negative'}`}>
              {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}