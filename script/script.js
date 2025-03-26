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

function displayPortfolio() {
    let list = document.getElementById("portfolioList");
    list.innerHTML = "";
    let total = 0;

    portfolio.forEach((coin, index) => {
        let value = coin.amount * coin.price;
        total += value;

        let li = document.createElement("li");
        li.innerHTML = `${coin.symbol}: ${coin.amount} (${value.toFixed(2)}) 
        <button class="remove-btn" onclick="removeCrypto(${index})">❌</button>`;
        list.appendChild(li);
    });

    document.getElementById("totalValue").innerText = `${total.toFixed(2)}`;
}

function removeCrypto(index) {
    portfolio.splice(index, 1);
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
    displayPortfolio();
}

window.onload = displayPortfolio;








