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







