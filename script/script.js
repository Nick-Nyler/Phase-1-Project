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
    let inputSymbol = document.getElementById("cryptoSymbol").value.trim().toLowerCase();
    let amount = parseFloat(document.getElementById("cryptoAmount").value);

    if (!inputSymbol || isNaN(amount) || amount <= 0) {
        alert("Enter a valid crypto symbol and amount!");
        return;
    }

    // Standardize symbol: convert full names to ticker symbols if needed
    let standardizedSymbol = Object.keys(coinMap).find(key => coinMap[key] === inputSymbol) || inputSymbol;
    standardizedSymbol = standardizedSymbol.toUpperCase(); // Ensure consistent uppercase format
    
    let price = await fetchCryptoPrice(standardizedSymbol);
    if (price === 0) {
        alert("Invalid crypto symbol or API issue!");
        return;
    }

    let existingEntry = portfolio.find(entry => entry.symbol === standardizedSymbol);
    if (existingEntry) {
        existingEntry.amount += amount;
    } else {
        let entry = { symbol: standardizedSymbol, amount, price };
        portfolio.push(entry);
    }

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
        <button class="reduce-btn" onclick="reduceCrypto(${index})">➖</button>
        <button class="remove-btn" onclick="removeCrypto(${index})">❌</button>`;
        list.appendChild(li);
    });

    document.getElementById("totalValue").innerText = `${total.toFixed(2)}`;
}

function removeCrypto(index) {
    if (confirm("Are you sure you want to remove this crypto?")) {
        portfolio.splice(index, 1);
        localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
        displayPortfolio();
    }
}

function reduceCrypto(index) {
    let entry = portfolio[index];
    let reduceAmount = parseFloat(prompt(`Enter amount to reduce from ${entry.symbol} (Current: ${entry.amount}):`));
    
    if (isNaN(reduceAmount) || reduceAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (reduceAmount >= entry.amount) {
        if (confirm(`Reducing ${entry.amount} will remove ${entry.symbol} from your portfolio. Continue?`)) {
            portfolio.splice(index, 1);
        }
    } else {
        entry.amount -= reduceAmount;
    }
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
    displayPortfolio();
}


window.onload = displayPortfolio;









