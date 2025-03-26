let portfolio = JSON.parse(localStorage.getItem("cryptoPortfolio")) || [];

const coinMap = {
    btc: "bitcoin",
    eth: "ethereum",
    xrp: "ripple",
    ada: "cardano",
    sol: "solana",
    doge: "dogecoin",
    dot: "polkadot",
    usdt: "tether",
    bnb: "binancecoin"
};

async function fetchCryptoPrice(symbol) {
    let coinId = coinMap[symbol.toLowerCase()] || symbol.toLowerCase(); 
    try {
        let url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
        let response = await fetch(url);
        let data = await response.json();

        return data[coinId]?.usd ? parseFloat(data[coinId].usd) : 0;
    } catch (error) {
        console.error("Error fetching price:", error);
        return 0;
    }
}

async function addCrypto() {
    let symbol = document.getElementById("cryptoSymbol").value.trim().toLowerCase();
    let amount = parseFloat(document.getElementById("cryptoAmount").value);

    if (!symbol || isNaN(amount) || amount <= 0) {
        alert("Enter a valid crypto symbol and amount!");
        return;
    }

    let price = await fetchCryptoPrice(symbol);
    if (price === 0) {
        alert("Invalid crypto symbol or API issue!");
        return;
    }

    let entry = { symbol: symbol.toUpperCase(), amount, price };
    portfolio.push(entry);
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));

    displayPortfolio();
}









