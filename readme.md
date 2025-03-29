# Crypto Portfolio Tracker

## Project Overview

This is a **Single Page Application (SPA)** that allows users to manage their cryptocurrency portfolio. The application fetches real-time data from the **CoinGecko API** and enables users to add, modify, and remove cryptocurrencies from their portfolio.

## Learning Goals

- Design and architect frontend features using HTML, CSS, and JavaScript.
- Communicate with an external API asynchronously.
- Debug and iterate on a working project MVP.
- Implement event listeners and interactivity.
- Maintain clean and organized code following best practices.

## Features

- **Dark Mode Toggle** for a better user experience.
- **Real-time Crypto Price Fetching** using CoinGecko API.
- **Portfolio Management**: Add, buy, sell, and remove cryptocurrencies.
- **Transaction History**: Track buy, sell, and withdrawal transactions.
- **Filter/Search Functionality** for easy coin lookup.

## Project Requirements Fulfillment

1. **Frontend Technology:** Built using HTML, CSS, and JavaScript.
2. **Public API Usage:** Uses the [CoinGecko API](https://www.coingecko.com/) for real-time cryptocurrency prices.
3. **Single Page Application:** No redirects or page reloads.
4. **At least 3 event listeners:**
   - Click event for buying, selling, and withdrawing crypto.
   - Input event for filtering portfolio.
   - Click event for toggling dark mode.
5. **Array Iteration Methods:**
   - `forEach` is used to display the portfolio.
   - `map` is used for transaction history formatting.
   - `filter` is used for portfolio search.
6. **DRY Coding Practices:** Functions are used to reduce redundant code.

## API Data Structure

The app fetches cryptocurrency data in the following format:

```json
{
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "market_data": {
        "current_price": {
            "usd": 50000
        }
    },
    "image": {
        "large": "https://assets.coingecko.com/bitcoin.png"
    }
}
```

## Challenges and Considerations

- **API Rate Limits:** CoinGecko has limits on requests per minute.
- **Handling Invalid Symbols:** Implemented error handling for incorrect inputs.
- **Local Storage Management:** Ensuring data persistence across sessions.

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone <repo-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd crypto-portfolio-tracker
   ```
3. Open `index.html` in a browser.

## Stretch Goals

- **Use JSON Server** to store transaction history persistently.
- **Improve UI/UX** with animations and enhanced styling.
- **Add Price Alerts** when a crypto reaches a certain threshold.

## Summary

This project showcases JavaScript skills in building an interactive, API-powered application while following best coding practices. 🚀


### website link
https://nick-nyler.github.io/Phase-1-Project/
