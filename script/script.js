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

async function fetchCryptoDetails(symbol) {
    let coinId = coinMap[symbol.toLowerCase()] || symbol.toLowerCase();
    try {
        let url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
        let response = await fetch(url);
        let data = await response.json();

        return {
            price: data.market_data?.current_price?.usd || 0,
            image: data.image?.large || ""
        };
    } catch (error) {
        console.error("Error fetching coin details:", error);
        return { price: 0, image: "" };
    }
}

async function addCrypto() {
    let inputSymbol = document.getElementById("cryptoSymbol").value.trim().toLowerCase();
    let amount = parseFloat(document.getElementById("cryptoAmount").value);

    if (!inputSymbol || isNaN(amount) || amount <= 0) {
        alert("Enter a valid crypto symbol and amount!");
        return;
    }

    let standardizedSymbol = Object.keys(coinMap).find(key => coinMap[key] === inputSymbol) || inputSymbol;
    standardizedSymbol = standardizedSymbol.toUpperCase();

    let { price, image } = await fetchCryptoDetails(standardizedSymbol);
    if (price === 0) {
        alert("Invalid crypto symbol or API issue!");
        return;
    }

    let existingEntry = portfolio.find(entry => entry.symbol === standardizedSymbol);
    if (existingEntry) {
        existingEntry.amount += amount;
    } else {
        let entry = { symbol: standardizedSymbol, amount, price, image };
        portfolio.push(entry);
    }

    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
    displayPortfolio();
}

function displayPortfolio() {
    let list = document.getElementById("portfolioList");
    let imageContainer = document.getElementById("cryptoImages");
    list.innerHTML = "";
    imageContainer.innerHTML = "";
    let total = 0;

    portfolio.forEach((coin, index) => {
        let value = coin.amount * coin.price;
        total += value;

        let li = document.createElement("li");
        li.innerHTML = `${coin.symbol}: ${coin.amount} (${value.toFixed(2)}) 
         <button class="add-btn" onclick="increaseCrypto(${index})">➕</button>
        <button class="reduce-btn" onclick="reduceCrypto(${index})">➖</button>
        <button class="remove-btn" onclick="removeCrypto(${index})">❌</button>`;
        
        list.appendChild(li);

        if (coin.image) {
            let img = document.createElement("img");
            img.src = coin.image;
            img.alt = coin.symbol;
            img.classList.add("crypto-img");
            imageContainer.appendChild(img);
        }
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

function increaseCrypto(index) {
    let entry = portfolio[index];
    let addAmount = parseFloat(prompt(`Enter amount to add for ${entry.symbol} (Current: ${entry.amount}):`));
    
    if (isNaN(addAmount) || addAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    entry.amount += addAmount;
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
    displayPortfolio();
}

window.onload = displayPortfolio;









