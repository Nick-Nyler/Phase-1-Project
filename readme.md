# Crypto Portfolio Tracker

## Project Overview
This is a **Single Page Application (SPA)** that allows users to track their cryptocurrency portfolio. Users can add, update, and remove cryptocurrencies, and the app fetches live price data from the **CoinGecko API**. The portfolio is stored in **localStorage**, ensuring data persistence across page reloads.

## Features
- **Add Cryptocurrencies:** Users can input a cryptocurrency symbol (e.g., BTC) and amount to add to their portfolio.
- **Live Price Fetching:** Uses the CoinGecko API to fetch real-time cryptocurrency prices.
- **Modify Portfolio:** Users can increase or decrease holdings or remove a cryptocurrency from the portfolio.
- **LocalStorage Support:** Portfolio data is saved in localStorage for persistence.
- **Dynamic UI Updates:** The page updates dynamically without reloading.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript (Vanilla JS)
- **API:** CoinGecko API (No API key required)
- **Storage:** LocalStorage (for saving portfolio data)

## Project Requirements Check
| Requirement | Implementation |
|-------------|---------------|
| **HTML/CSS/JS SPA** | ✅ Uses HTML, CSS, and JavaScript with no page reloads |
| **Public API Integration** | ✅ Fetches data from the CoinGecko API |
| **At Least 3 Event Listeners** | ✅ Click events for adding, removing, and modifying crypto amounts |
| **Array Iteration Methods** | ✅ Uses `forEach` to display portfolio items |
| **Good Coding Practices (DRY, Modular)** | ✅ Functions abstract repetitive logic |
| **Persistence** | ✅ Uses LocalStorage to retain portfolio data |

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio-tracker.git
   ```
2. Navigate to the project folder:
   ```bash
   cd crypto-portfolio-tracker
   ```
3. Open `index.html` in a browser.

## How to Use
1. **Enter a cryptocurrency symbol** (e.g., BTC, ETH) and an amount.
2. **Click "Add to Portfolio"** to add it.
3. **Modify holdings** using the ➕ and ➖ buttons.
4. **Remove a cryptocurrency** with the ❌ button.
5. **View your total portfolio value** at the bottom.

## Future Enhancements
- Add **search functionality** to filter portfolio items.
- Implement **dark mode** for better UI customization.
- Use `json-server` for a simulated backend.

## License
This project is open-source under the **MIT License**.

### website link
https://nick-nyler.github.io/Phase-1-Project/
