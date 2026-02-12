import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  createContext,
} from "react";
import "./FinanceDashboard.css";

// Create StockContext
const StockContext = createContext();

export default function FinanceDashboard() {
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState("No stocks added yet");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debounceTimer = useRef(null);

  // Fetch ticker suggestions
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
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSuggestions(data.quotes || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setStatus("Error fetching data. Please try again later.");
      setSuggestions([]);
    }
  }

  // Fetch live price
  async function fetchLivePrice(symbol) {
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        )}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (!meta) return null;

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const marketState = meta.marketState;
      const price = marketState === "CLOSED" ? previousClose : currentPrice;

      return {
        price,
        marketState,
      };
    } catch (err) {
      console.error("Error fetching live price:", err);
      return null;
    }
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !qty || !value) {
      setStatus("Please fill in all fields before submitting!");
      return;
    }

    // Validate ticker using Yahoo API
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=${encodeURIComponent(
          "https://query1.finance.yahoo.com/v1/finance/search?q=" + name,
        )}`,
      );
      const data = await response.json();
      const valid = data.quotes?.some(
        (s) => s.symbol.toUpperCase().trim() === name.toUpperCase().trim(),
      );
      if (!valid) {
        setStatus("Invalid ticker symbol. Please check the code.");
        return;
      }
    } catch {
      setStatus("Error validating ticker.");
      return;
    }

    const liveData = await fetchLivePrice(name);
    if (!liveData) {
      setStatus("Could not fetch live price. Please try again later.");
      return;
    }

    const { price, marketState } = liveData;
    const purchaseTotal = Number(qty) * Number(value);
    const currentTotal = Number(qty) * price;
    const net = currentTotal - purchaseTotal;

    const newStock = {
      id: Date.now(),
      name,
      qty: Number(qty),
      value: Number(value),
      livePrice: price,
      net,
      marketState,
    };

    setStocks((prev) => [...prev, newStock]);

    setName("");
    setQty("");
    setValue("");
    setSuggestions([]);
  }

  // Memoized refreshPrices
  const refreshPrices = useCallback(async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (s) => {
        try {
          const response = await fetch(
            `https://corsproxy.io/?url=${encodeURIComponent(
              `https://query1.finance.yahoo.com/v8/finance/chart/${s.name}`,
            )}`,
          );
          const data = await response.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta) return s;

          const currentPrice = meta.regularMarketPrice;
          const previousClose = meta.previousClose;
          const marketState = meta.marketState;
          const price = marketState === "CLOSED" ? previousClose : currentPrice;

          const purchaseTotal = s.qty * s.value;
          const currentTotal = s.qty * price;
          const net = currentTotal - purchaseTotal;

          return {
            ...s,
            livePrice: price,
            net,
            marketState,
          };
        } catch {
          return s;
        }
      }),
    );
    setStocks(updatedStocks);
  }, [stocks]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (stocks.length === 0) return;
    const interval = setInterval(() => {
      refreshPrices();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshPrices]);

  return (
    <StockContext.Provider
      value={{
        stocks,
        setStocks,
      }}
    >
      <main>
        <h3 className="dashboard_title"> Finance Dashboard </h3>
        {/* Form */}{" "}
        <form className="stock_row" onSubmit={handleSubmit}>
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
                      ticker,
                  )}`,
                );
                const data = await response.json();
                const valid = data.quotes?.some(
                  (s) => s.symbol.toUpperCase().trim() === ticker,
                );
                setStatus(
                  valid
                    ? "Ticker symbol is valid."
                    : "Invalid ticker symbol. Please check the code.",
                );
              } catch {
                setStatus("Error validating ticker.");
              }
            }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions_dropdown">
              {" "}
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
                  {s.symbol}— {s.shortname || s.longname}{" "}
                </li>
              ))}{" "}
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
            onFocus={() => setSuggestions([])}
          />{" "}
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
          />{" "}
          <button type="submit" className="add_stock">
            Add Stock{" "}
          </button>{" "}
        </form>
        <div className="stock_list"> Stock List </div>{" "}
        <div className="stock_append_status"> {status} </div>
        <StockList />
        {stocks.length > 0 && <MarketInfo />}{" "}
      </main>{" "}
    </StockContext.Provider>
  );
}

// Child component consuming context
function StockList() {
  const { stocks } = useContext(StockContext);

  return (
    <ul className="stock_entries">
      {" "}
      {stocks.map((s) => {
        let profitClass = "neutral";
        if (s.net > 0) profitClass = "profit";
        else if (s.net < 0) profitClass = "loss";
        return (
          <li key={s.id} className="stock_entry">
            Added {s.name}— {s.qty}@ {s.value.toFixed(2)} - Last Done Price:{" "}
            {s.livePrice.toFixed(2)} <br />
            Profit / Loss:{" "}
            <span className={profitClass}> {s.net.toFixed(2)} </span>{" "}
          </li>
        );
      })}{" "}
    </ul>
  );
}

// MarketInfo component
function MarketInfo() {
  const now = new Date();
  const usTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/New_York",
    }),
  );
  const sgTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Singapore",
    }),
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
      {" "}
      <br /> Market Status: {marketStatus}{" "}
      {timeToOpen && ` [ Market opens in ${timeToOpen} ]`} <br /> US Local Time:{" "}
      {usTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}{" "}
      hrs <br /> SG Local Time:{" "}
      {sgTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}{" "}
      hrs{" "}
    </div>
  );
}
