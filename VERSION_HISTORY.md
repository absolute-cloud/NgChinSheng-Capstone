# NgChinSheng Capstone - Version History & Changelog

A comprehensive overview of the development progression of the Stock Tracker Application from initial setup through version 8.

---

## Version 0 (Initial Commit)
**Commit:** `a2e1b7a`

### Overview
Started with a blank Vite + React template setup.

### Key Changes
- Initial project structure using Vite as the build tool
- Default React template files
- Basic package.json configuration
- Standard folder structure created

### Technical Stack
- React
- Vite
- CSS

---

## Version 1 (Template Cleanup)
**Commit:** `e0d62e8` → Merged in `864479d`  
**Branch:** `Stockform`

### Overview
Removed boilerplate React template code and began implementation of the stock form component.

### Key Changes
- Removed default Vite + React logo animations and template code
- Cleaned up unnecessary CSS styles and animations
- Refactored App.jsx to prepare for custom components
- Removed template button counter logic
- Created foundational structure for stock tracking functionality

### Files Modified
- `App.jsx` - Removed template boilerplate
- `App.css` - Removed unused logo and animation styles
- `index.css` - Simplified global styles

---

## Version 2 (Stock Form Implementation)
**Commit:** `14bd8d8` → Merged in `1c1c1a6`  
**Branch:** `ver-2`

### Overview
Implemented basic stock form with UI/UX styling and core input handling logic.

### Key Changes
- Created `StockForm` component with input fields for stock ticker, quantity, and purchase value
- Implemented form submission handling
- Added basic CSS styling for professional appearance
- Added form validation for empty inputs
- Created initial stock entry display structure

### Features Added
- Stock ticker input field
- Quantity input field
- Purchase price input field
- Submit button with basic styling
- Status message display for user feedback

### UI Improvements
- Professional color scheme (dark theme with accent colors)
- Responsive form layout
- Styled input fields with focus states
- Added button hover effects

---

## Version 3 (Input Validation & Formatting)
**Commit:** `57aca16` → Merged in `2b5a984`  
**Branch:** `ver-3`

### Overview
Enhanced input handling with validation logic, decimal formatting, and type conversions.

### Key Changes
- Added comprehensive empty input validation
- Implemented automatic decimal formatting for price inputs
- Added type conversion logic for numeric fields
- Prevented invalid characters in price inputs
- Enhanced form state management

### Features Added
- Decimal place formatting (toFixed(2) for currency)
- Input sanitization to prevent special characters
- Improved error messages for better user guidance
- Stock entry data structure with proper typing

### Bug Fixes
- Fixed value input to accept only numeric and decimal values
- Corrected quantity input to accept only whole numbers

---

## Version 4 (Dropdown Enhancement)
**Commit:** `bc62cec` → Merged in `62e381c`  
**Branch:** `ver-4`

### Overview
Added dropdown suggestions using Yahoo Finance API for stock ticker autocomplete.

### Key Changes
- Integrated Yahoo Finance API for ticker symbol validation and suggestions
- Implemented autocomplete dropdown menu
- Added real-time suggestion fetching as user types
- Created dropdown UI component with styling

### Features Added
- **Dropdown Suggestions** - Shows matching stock symbols as user types
- **API Integration** - Fetches data from Yahoo Finance API
- **Autocomplete** - Click to select from suggestions
- **Keyboard Support** - Can type or select from dropdown
- **Validation** - Checks ticker symbol validity before submission

### Technical Details
- Used fetch API to query `query1.finance.yahoo.com`
- Implemented debouncing for search queries
- Added dropdown styling and hover effects

---

## Version 5 (CORS & Ticker Validation)
**Commit:** `7eca27c` → Merged in `484e3f2`  
**Branch:** `ver-5`

### Overview
Solved CORS (Cross-Origin Resource Sharing) issues and improved ticker symbol validation.

### Key Changes
- Implemented CORS proxy (`corsproxy.io`) to handle API requests
- Enhanced ticker validation logic before adding stocks
- Improved error handling for API failures
- Added fallback mechanisms for API timeouts

### Features Added
- **CORS Proxy Integration** - Enables requests to Yahoo Finance API from browser
- **Enhanced Validation** - Checks if ticker symbol exists in stock database
- **Better Error Handling** - Displays specific error messages for different scenarios
- **Status Messages** - Real-time feedback if ticker is valid or invalid

### Bug Fixes
- Fixed Unable to fetch from Yahoo Finance due to CORS restrictions
- Improved API error handling and retry logic

---

## Version 6 (Live Price Integration & Refactoring)
**Commit:** `b49cf78` → Merged in `afbc64e`  
**Branch:** `ver-6`

### Overview
Major refactor with live price integration, comprehensive validation, and market information display.

### Key Changes
- Integrated live stock price fetching
- Created `FinanceDashboard` component to replace basic form
- Implemented profit/loss calculation in real-time
- Added market indices display (S&P 500, Nasdaq, Dow Jones, VIX)
- Comprehensive CSS styling for professional dashboard appearance
- Separated concerns into multiple components (StockList, MarketInfo)

### Features Added
- **Live Price Updates** - Fetches current stock prices from Yahoo Finance
- **Profit/Loss Calculation** - Real-time P/L based on entry and current price
- **Market Dashboard** - Displays S&P 500, Nasdaq, Dow Jones, VIX indices
- **Portfolio Summary** - Shows total invested, current value, and total gain/loss
- **Professional Styling** - Dark theme with accent colors and smooth transitions
- **Basic Market Info** - Shows US/SG time and market status

### Technical Improvements
- Refactored component structure for better maintainability
- Implemented context API for state management
- Added async/await for API calls
- Created responsive grid layouts

### CSS Enhancements
- Created `FinanceDashboard.css` (708 lines) with comprehensive styling
- Hero section with gradient background
- Card-based UI for stock holdings
- Responsive grid layout for holdings display
- Bid/Ask price display
- Color-coded profit/loss indicators

---

## Version 7 (Auto-Refresh, Context & Memoization)
**Commit:** `bb38aba` → Merged in `cf38200`  
**Branch:** `ver-7`  
**Classification:** ENHANCEMENT (Beyond Core Requirements)

### Overview
Added automatic price refresh functionality (not required by specification), improved state management with Context API, and optimized components with React.memo.

### Key Changes
- Implemented auto-refresh for stock prices every 15 seconds (ENHANCEMENT)
- Implemented auto-refresh for market indices every 30 seconds (ENHANCEMENT)
- Added useCallback hooks for optimized re-renders
- Integrated StockContext for global state management
- Refactored to use React.memo for performance optimization
- Created separate utility functions for price and index fetching

### Features Added
- **Auto-Refresh** ⭐ - Automatic price updates every 15 seconds (not required)
- **Market Index Auto-Refresh** ⭐ - Updates indices every 30 seconds (not required)
- **Performance Metrics** - Total gains, total losses, win rate calculations
- **Better State Management** - Uses Context API to avoid prop drilling
- **Memoization** - Prevents unnecessary re-renders with useCallback

### UX Improvements
- Users see live updated prices without manual refresh (bonus feature)
- Smooth transitions and animations
- Performance metrics displayed prominently

### Technical Details
- useCallback for memo optimization
- useRef for debounce timer management
- Context API for global stock and indices state
- Set intervals with cleanup in useEffect

### Note on Requirements Compliance
The **core requirement** (v6) was:
- ✅ Fetch current price on component mount
- ✅ Fetch when stock list is updated

This version **adds** continuous auto-refresh, which was **not** a baseline requirement but improves user experience significantly.

---

## Version 8 (UI/UX Refinement & Deployment)
**Commit:** `12a1ca9` → Merged in `49f9bb6`  
**Branch:** `ver-08`

### Overview
Professional UI/UX redesign with enhanced styling, better information hierarchy, and GitHub Pages deployment configuration.

### Key Changes
- Completely redesigned dashboard UI for professional appearance
- Created more structured portfolio summary cards
- Enhanced market information display with formatted indices
- Improved CSS with better color schemes and typography
- Added GitHub Pages deployment workflow
- Updated HTML title to "Stock Tracker App"

### Features Added
- **Enhanced Portfolio Summary** - Four-column card layout showing:
  - Portfolio Value (current market value)
  - Total Invested (cost basis)
  - Total Return (profit/loss with percentage)
  - Holdings (number of stocks)
- **Performance Metrics Section** - Displays:
  - Total Gains (sum of profitable positions)
  - Total Losses (sum of losing positions)
  - Win Rate (percentage of winning positions)
- **Better Market Info Display** - Individual cards for each index with:
  - Index name and value
  - Change percentage with color coding
- **Professional Styling** - Enhanced colors, spacing, and typography
- **Bid/Ask Display** - Shows bid and ask prices for each holding
- **Color-Coded Values** - Visual indicators for gains (green), losses (red), neutral (blue)

### UI/UX Improvements
- Gradient backgrounds with depth
- Improved card designs with hover effects
- Better visual hierarchy
- Enhanced typography and spacing
- Cleaner form inputs and buttons
- More prominent status indicators
- Professional color palette:
  - Primary: `#66fcf1` (cyan)
  - Success: `#45a29e` (teal)
  - Danger: `#ff4c4c` / `#ff6b6b` (red)
  - Background: `#0a0e27` to `#1a2638` (dark blue)

### Deployment
- **Added GitHub Actions Workflow** (`.github/workflows/static.yml`)
  - Builds and deploys to GitHub Pages
  - Triggers on push to `ver-08` branch
  - Uploads dist folder to GitHub Pages

### Files Updated
- Complete redesign of `FinanceDashboard.css` (708 lines)
- Enhanced `FinanceDashboard.jsx` with new layout components
- Updated `App.jsx` and `App.css`
- Modified `index.html` with new title
- Created GitHub Actions deployment workflow

### Performance Features
- Memoized components to prevent unnecessary re-renders
- Efficient auto-refresh intervals
- Debounced API calls
- Context-based state management

---

## Summary of Development Journey

| Version | Focus | Core/Enhancement | Major Features |
|---------|-------|------------------|-----------------|
| **v0** | Setup | N/A | Initial Vite + React template |
| **v1** | Cleanup | Core | Removed boilerplate, component structure |
| **v2** | Core Form | Core | Stock form with basic styling |
| **v3** | Validation | Core | Input validation and formatting |
| **v4** | Autocomplete | Core | Dropdown suggestions from Yahoo Finance |
| **v5** | CORS Fix | Core | Implemented proxy for API requests |
| **v6** | Live Data | Core | Live prices (on mount & update), dashboard, market indices |
| **v7** | Performance | **ENHANCEMENT** | Auto-refresh (15s), Context API, memoization |
| **v8** | Design | **ENHANCEMENT** | Professional UI/UX, deployment setup |

---

## Key Technologies Used

- **Frontend Framework:** React
- **Build Tool:** Vite
- **State Management:** React Context API, useState, useCallback, useRef
- **Data Source:** Yahoo Finance API (via corsproxy.io)
- **Styling:** CSS3 with Flexbox and Grid
- **Deployment:** GitHub Pages with GitHub Actions
- **Version Control:** Git with feature branches

---

## Core Requirements vs Enhancements

### ✅ Core Requirements Fulfilled (v0-v6)
- Add stock positions with ticker, quantity, price
- Fetch prices **on component mount**
- Fetch prices **when stock list updates**
- Calculate profit/loss automatically
- Validate stock symbols
- Prevent invalid entries
- Form with proper inputs
- Display holdings list
- Responsive design
- Error handling

### 🚀 Enhancements Beyond Requirements (v7-v8)
- Auto-refresh every 15 seconds
- Market indices tracking
- Performance metrics dashboard
- UI/UX professional redesign
- Market status indicator
- Multi-timezone support
- Bid/Ask display
- GitHub Pages deployment

---

## Current Features in Production (v8)

### Core Requirements (Baseline) ✅
✅ Add new stock positions with ticker, quantity, and purchase price  
✅ Price fetching on component mount and when stock list updates  
✅ Automatic profit/loss calculation  
✅ Form validation and invalid ticker prevention  
✅ Responsive design across all devices  

### Enhanced Features (Beyond Requirements) 🚀
✨ Auto-refresh for stock prices every 15 seconds  
✨ Auto-refresh for market indices every 30 seconds  
✨ Market indices tracking (S&P 500, Nasdaq, Dow Jones, VIX)  
✨ Portfolio summary with key metrics  
✨ Win rate and performance metrics  
✨ US/Singapore time display with market status  
✨ Bid/Ask price display  
✨ Professional dark theme UI  
✨ GitHub Pages deployment  

---

## Future Enhancement Opportunities

Beyond the enhanced features already implemented:

- User authentication and data persistence (database)
- Historical price charts and technical analysis
- Portfolio performance analytics and reports
- Export portfolio data (CSV, PDF)
- Mobile app version
- Real-time notifications and alerts
- Advanced filtering and sorting
- Watchlist functionality
- Transaction history tracking
- Tax reporting features
- Options trading support
- DCA (Dollar Cost Averaging) calculator
- Portfolio rebalancing suggestions
