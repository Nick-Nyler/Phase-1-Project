let portfolio = JSON.parse(localStorage.getItem("cryptoPortfolio")) || [];
let transactionHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
const darkMode = localStorage.getItem("darkMode") === "enabled";

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

const body = document.body;
const container = document.querySelector(".container");
const darkModeToggle = document.getElementById("darkModeToggle");
const portfolioListElement = document.getElementById("portfolioList");
const filterInput = document.getElementById("filterInput");
const darkModeIcon = document.getElementById("darkModeIcon");
const lightModeIcon = document.getElementById("lightModeIcon");


function enableDarkMode() {
    body.classList.add("dark-mode");
    container.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
    darkModeIcon.style.display = 'none';
    lightModeIcon.style.display = 'inline';
}


function disableDarkMode() {
    body.classList.remove("dark-mode");
    container.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
    darkModeIcon.style.display = 'inline';
    lightModeIcon.style.display = 'none';
}

if (darkMode) {
    enableDarkMode();
}


darkModeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

function updatePortfolio() {
    localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
    displayPortfolio();
}

function updateTransactionHistory() {
    localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));
    displayTransactionHistory();
}

function isValidAmount(amount) {
    return !(isNaN(amount) || amount <= 0);
}

async function fetchCryptoDetails(symbol) {
    let coinId = coinMap[symbol.toLowerCase()] || symbol.toLowerCase();
    try {
        let url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Invalid symbol: ${symbol}`);
        }

        let data = await response.json();

        return {
            price: data.market_data?.current_price?.usd || 0,
            image: data.image?.large || ""
        };
    } catch (error) {
        console.error("Error fetching coin details:", error);
        alert("Invalid crypto symbol or API issue!");
        return { price: 0, image: "" };
    }
}


async function addCrypto() {
    let inputSymbol = document.getElementById("cryptoSymbol").value.trim().toLowerCase();
    let amount = parseFloat(document.getElementById("cryptoAmount").value);

    if (!inputSymbol || !isValidAmount(amount)) {
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
        portfolio.push({ symbol: standardizedSymbol, amount, price, image });
    }

    transactionHistory.push({
        timestamp: new Date().toISOString(),
        symbol: standardizedSymbol,
        amount: amount,
        type: "buy",
        priceAtTransaction: price
    });
    updateTransactionHistory();
    updatePortfolio();
    document.getElementById("cryptoSymbol").value = "";
    document.getElementById("cryptoAmount").value = "";

}

function modifyCryptoAmount(index, change) {
    let entry = portfolio[index];
    let newAmount = entry.amount + change;
    const transactionType = change > 0 ? "buy" : "sell";
    const transactionAmount = Math.abs(change);

    transactionHistory.push({
        timestamp: new Date().toISOString(),
        symbol: entry.symbol,
        amount: transactionAmount,
        type: transactionType,
        priceAtTransaction: entry.price
    });
    updateTransactionHistory();

    if (newAmount <= 0) {
        if (confirm(`Reducing ${entry.amount} will withdraw ${entry.symbol} from your portfolio. Continue?`)) {
            portfolio.splice(index, 1);
            transactionHistory.push({
                timestamp: new Date().toISOString(),
                symbol: entry.symbol,
                amount: entry.amount,
                type: "withdraw",
                priceAtTransaction: entry.price
            });
            updateTransactionHistory();
        }
    } else {
        entry.amount = newAmount;
    }
    updatePortfolio();
}

function reduceCrypto(index) {
    let reduceAmount = parseFloat(prompt(`Enter amount to sell from ${portfolio[index].symbol} (Current: ${portfolio[index].amount}):`));
    if (!isValidAmount(reduceAmount)) {
        alert("Please enter a valid amount.");
        return;
    }
    modifyCryptoAmount(index, -reduceAmount);
}

function increaseCrypto(index) {
    let addAmount = parseFloat(prompt(`Enter amount to buy for ${portfolio[index].symbol} (Current: ${portfolio[index].amount}):`));
    if (!isValidAmount(addAmount)) {
        alert("Please enter a valid amount.");
        return;
    }
    modifyCryptoAmount(index, addAmount);
}

function removeCrypto(index) {
    if (confirm("Are you sure you want to withdraw this crypto?")) {
        transactionHistory.push({
            timestamp: new Date().toISOString(),
            symbol: portfolio[index].symbol,
            amount: portfolio[index].amount,
            type: "withdraw",
            priceAtTransaction: portfolio[index].price
        });
        updateTransactionHistory();
        portfolio.splice(index, 1);
        updatePortfolio();
    }
}

function displayPortfolio() {
    let list = document.getElementById("portfolioList");
    let imageContainer = document.getElementById("cryptoImages");
    list.innerHTML = "";
    imageContainer.innerHTML = "";
    let total = 0;
    const filterValue = filterInput.value.toUpperCase();

    portfolio.forEach((coin, index) => {
        let value = coin.amount * coin.price;
        total += value;

        let li = document.createElement("li");
        li.innerHTML = `${coin.symbol}: ${coin.amount} ($${value.toFixed(2)})
            <button class="buy-btn" onclick="increaseCrypto(${index})">Buy</button> <button class="sell-btn" onclick="reduceCrypto(${index})">Sell</button> <button class="withdraw-btn" onclick="removeCrypto(${index})">Withdraw</button>`;

        const symbolMatch = coin.symbol.toUpperCase().includes(filterValue);
        li.style.display = symbolMatch ? "" : "none";

        list.appendChild(li);

        if (coin.image) {
            let img = document.createElement("img");
            img.src = coin.image;
            img.alt = coin.symbol;
            img.classList.add("crypto-img");
            imageContainer.appendChild(img);
        }
    });

    document.getElementById("totalValue").innerText = `$${total.toFixed(2)}`;
}

function displayTransactionHistory() {
    const historyContainer = document.getElementById("transactionHistory");
    if (!historyContainer) return;

    historyContainer.innerHTML = "<h3>Transaction History</h3>";
    const historyList = document.createElement("ul");

    transactionHistory.forEach(transaction => {
        const listItem = document.createElement("li");
        const formattedDate = new Date(transaction.timestamp).toLocaleString();
        let transactionText = `${formattedDate}: ${transaction.type.toUpperCase()} - ${transaction.symbol} (${transaction.amount} @ $${transaction.priceAtTransaction.toFixed(2)})`;
        listItem.classList.add(transaction.type);

        if (transaction.type === 'buy') {
            transactionText = `${formattedDate}: BOUGHT - ${transaction.symbol} (${transaction.amount} @ $${transaction.priceAtTransaction.toFixed(2)})`;
        } else if (transaction.type === 'sell') {
            transactionText = `${formattedDate}: SOLD - ${transaction.symbol} (${transaction.amount} @ $${transaction.priceAtTransaction.toFixed(2)})`;
        } else if (transaction.type === 'withdraw') {
            transactionText = `${formattedDate}: WITHDRAWN - ${transaction.symbol} (${transaction.amount} @ $${transaction.priceAtTransaction.toFixed(2)})`;
        }
        listItem.textContent = transactionText;
        historyList.appendChild(listItem);
    });

    historyContainer.appendChild(historyList);
}

filterInput.addEventListener('input', displayPortfolio);
window.onload = () => {
    displayPortfolio();
    displayTransactionHistory();
    if (darkMode) {
        enableDarkMode();
    }
};
