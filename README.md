<<<<<<< HEAD
# https://absolute-cloud.github.io/NgChinSheng-Capstone
=======
## 🎯 Project Overview

A professional React-based stock portfolio tracker that enables users to monitor their investments in real-time. The application fetches live stock prices, calculates profit/loss, and displays market indices with a modern, responsive user interface.

**Live Demo**: https://absolute-cloud.github.io/NgChinSheng-Capstone/  
**Repository**: https://github.com/absolute-cloud/NgChinSheng-Capstone

## ✨ Key Features

### Core Functionality ✅
- **Stock Portfolio Management** - Add and track multiple stock positions
- **Price Fetching** - Live prices fetched on mount and when stock list updates
- **Profit/Loss Calculation** - Automatic calculation based on entry vs current price
- **Form Validation** - Validates stock symbols and prevents invalid entries
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### Enhanced Features 🚀 (Beyond Requirements)
- **Auto-Refresh** - Automatic price updates every 15 seconds
- **Market Indices** - Real-time tracking of S&P 500, Nasdaq, Dow Jones, VIX (every 30 seconds)
- **Portfolio Analytics** - Total gains, losses, win rate calculations
- **Market Status** - Shows if US market is open/closed with countdown
- **Multi-timezone** - Displays US EST and Singapore SGT times
- **Performance Metrics** - Comprehensive portfolio performance dashboard
- **Bid/Ask Display** - Simulated market spreads
- **Professional UI** - Dark theme with gradient backgrounds and smooth animations

## 📂 Project Structure

```
├── my-react-app/                    # Main React application
│   ├── src/
│   │   ├── FinanceDashboard.jsx    # Main component (534 lines)
│   │   ├── FinanceDashboard.css    # Styling (708 lines)
│   │   ├── App.jsx                 # App wrapper
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Dependencies
│   ├── vite.config.js              # Vite configuration
│   └── README.md                   # Detailed project documentation
├── .github/
│   └── workflows/
│       └── static.yml              # GitHub Actions deployment
├── VERSION_HISTORY.md              # Version progression (v0-v8)
├── CAPSTONE_SCREENSHOTS_DOCUMENTATION.md  # Q&A responses
└── README.md                       # This file
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19.2.0 |
| **Build Tool** | Vite 7.2.4 |
| **Styling** | CSS3 (Grid, Flexbox) |
| **State Management** | React Context API + Hooks |
| **API Integration** | Yahoo Finance API |
| **CORS Handling** | corsproxy.io |
| **Deployment** | GitHub Pages + GitHub Actions |
| **Package Manager** | npm |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/absolute-cloud/NgChinSheng-Capstone.git
cd NgChinSheng-Capstone/my-react-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 📊 Development Journey

### Version History

| Version | Focus | Key Features |
|---------|-------|--------------|
| **v0** | Setup | Initial Vite + React template |
| **v1** | Cleanup | Removed boilerplate, component structure |
| **v2** | Core Form | Stock form with basic styling |
| **v3** | Validation | Input validation & decimal formatting |
| **v4** | Autocomplete | Dropdown suggestions from API |
| **v5** | CORS Fix | Implemented proxy for API requests |
| **v6** | Live Data | Live prices, dashboard, market indices |
| **v7** | Performance | Auto-refresh, Context API, memoization |
| **v8** | Design | Professional UI/UX, deployment setup |

**See [VERSION_HISTORY.md](VERSION_HISTORY.md) for detailed changelog.**

## 🎯 Capstone Requirements & Responses

The project fulfills all capstone requirements:

✅ **Q1: Git History** - 20 meaningful commits with clear progression  
✅ **Q2: Form Component** - Implemented with full validation and API integration  
✅ **Q3: Invalid Symbol Handling** - Prevents invalid tickers from being added  
✅ **Q4: Error Handling** - Comprehensive try/catch and error messaging  
✅ **Q5: Component Composition** - Parent-child component patterns with props  
✅ **Q6: Package.json** - React & Vite dependencies properly configured  
✅ **Q7: Profit/Loss Functions** - Live price fetching & calculation logic  
✅ **Q8: File Structure** - Organized component-based structure  
✅ **Q9: Deployed Application** - Live on GitHub Pages with real-time data  

**See [CAPSTONE_SCREENSHOTS_DOCUMENTATION.md](CAPSTONE_SCREENSHOTS_DOCUMENTATION.md) for detailed Q&A.**

## 🔑 React Concepts Implemented

### Hooks
- **useState** - Form inputs, stock list, status, indices management
- **useEffect** - Auto-refresh, side effects, cleanup
- **useCallback** - Memoized refresh functions for performance
- **useContext** - Global state (StockContext)
- **useRef** - Debounce timer management

### Advanced Patterns
- Context API for state management
- Custom hook composition
- Controlled components
- Conditional rendering
- Component memoization
- Proper dependency arrays

### Best Practices
- Separation of concerns
- Reusable components
- Proper error handling
- Performance optimization
- Responsive design
- Clean code structure

## 🐛 Challenges & Solutions

| Challenge | Solution | Learning |
|-----------|----------|----------|
| CORS Restrictions | Implemented corsproxy.io proxy | Browser security policies |
| API Rate Limiting | Added debouncing & fixed intervals | Optimize API calls |
| Stale Closures | Used useCallback with dependencies | Hook dependency management |
| Data Accuracy | Implemented proper type conversions | JavaScript precision |
| UI Performance | Used memoization & optimized rendering | React performance patterns |

## 📈 Beyond Requirements

This project goes **beyond baseline requirements** with:

🌟 Market indices integration (S&P 500, Nasdaq, Dow Jones, VIX)  
🌟 Auto-refresh functionality (eliminates manual refresh)  
🌟 Professional dark-themed UI with smooth animations  
🌟 Portfolio analytics dashboard (gains, losses, win rate)  
🌟 Market status indicator with countdown timer  
🌟 Multi-timezone support (US EST & Singapore SGT)  
🌟 Bid/Ask spread simulation  
🌟 GitHub Actions CI/CD pipeline  
🌟 Comprehensive documentation  
🌟 Component memoization for performance  

## 📝 Documentation Files

1. **[VERSION_HISTORY.md](VERSION_HISTORY.md)** - Complete version progression from v0 to v8
2. **[my-react-app/README.md](my-react-app/README.md)** - Detailed application documentation

## 🔗 Links

- **Live Application**: https://absolute-cloud.github.io/NgChinSheng-Capstone/
- **GitHub Repository**: https://github.com/absolute-cloud/NgChinSheng-Capstone

**Project Status**: ✅ **COMPLETE & DEPLOYED**
>>>>>>> 5401f30 (edited: README.md)
