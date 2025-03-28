let portfolio = JSON.parse(localStorage.getItem("cryptoPortfolio")) || [];
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


function enableDarkMode() {
    body.classList.add("dark-mode");
    container.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
}


function disableDarkMode() {
    body.classList.remove("dark-mode");
    container.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
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

    updatePortfolio();
    document.getElementById("cryptoSymbol").value = "";
    document.getElementById("cryptoAmount").value = "";

}

function modifyCryptoAmount(index, change) {
    let entry = portfolio[index];
    let newAmount = entry.amount + change;

    if (newAmount <= 0) {
        if (confirm(`Reducing ${entry.amount} will remove ${entry.symbol} from your portfolio. Continue?`)) {
            portfolio.splice(index, 1);
        }
    } else {
        entry.amount = newAmount;
    }
    updatePortfolio();
}

function reduceCrypto(index) {
    let reduceAmount = parseFloat(prompt(`Enter amount to reduce from ${portfolio[index].symbol} (Current: ${portfolio[index].amount}):`));
    if (!isValidAmount(reduceAmount)) {
        alert("Please enter a valid amount.");
        return;
    }
    modifyCryptoAmount(index, -reduceAmount);
}

function increaseCrypto(index) {
    let addAmount = parseFloat(prompt(`Enter amount to add for ${portfolio[index].symbol} (Current: ${portfolio[index].amount}):`));
    if (!isValidAmount(addAmount)) {
        alert("Please enter a valid amount.");
        return;
    }
    modifyCryptoAmount(index, addAmount);
}

function removeCrypto(index) {
    if (confirm("Are you sure you want to remove this crypto?")) {
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
            <button class="add-btn" onclick="increaseCrypto(${index})">➕</button>
        <button class="reduce-btn" onclick="reduceCrypto(${index})">➖</button>
        <button class="remove-btn" onclick="removeCrypto(${index})">❌</button>`;

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

filterInput.addEventListener('input', displayPortfolio);
window.onload = () => {
    displayPortfolio();
    
    if (darkMode) {
        enableDarkMode();
    }
};










