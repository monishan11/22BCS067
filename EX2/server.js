require('dotenv').config();
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

// Setup
const app = express();
const PORT = 3000;
const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';
const cache = new NodeCache();


const BEARER_TOKEN = process.env.BEARER_TOKEN;

// Utility: Calculate Average
function getAveragePrice(priceHistory) {
    const prices = priceHistory.map(p => p.price);
    const avg = prices.reduce((sum, val) => sum + val, 0) / prices.length;
    return parseFloat(avg.toFixed(6));
}

// Utility: Calculate Pearson Correlation
function calculateCorrelation(dataX, dataY) {
    const len = Math.min(dataX.length, dataY.length);
    const x = dataX.slice(0, len).map(d => d.price);
    const y = dataY.slice(0, len).map(d => d.price);

    const avgX = x.reduce((a, b) => a + b, 0) / x.length;
    const avgY = y.reduce((a, b) => a + b, 0) / y.length;

    const numerator = x.reduce((sum, val, i) => sum + ((val - avgX) * (y[i] - avgY)), 0);
    const denominator = Math.sqrt(
        x.reduce((sum, val) => sum + Math.pow(val - avgX, 2), 0) *
        y.reduce((sum, val) => sum + Math.pow(val - avgY, 2), 0)
    );

    const corr = numerator / denominator;
    return parseFloat(corr.toFixed(4));
}

// Function: Get Stock Prices from API or Cache
async function getStockPrices(ticker, minutes) {
    const cacheKey = `${ticker}_${minutes}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    console.log("HII");

    const url = `${BASE_URL}/${ticker}?minutes=${minutes}`;
    console.log("HIIIII",url);
    
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      },
    });
    console.log("HIIIIIIIIIIIII");
    console.log(res);
    const data = res.data;
    console.log(data);

    cache.set(cacheKey, data, 60); // Cache for 60 seconds
    return data;
}

// Route 1: Average Price API
app.get('/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    if (!minutes || isNaN(minutes)) {
        return res.status(400).json({ error: "Invalid or missing 'minutes' parameter" });
    }

    try {
        const priceHistory = await getStockPrices(ticker, minutes);

        if (aggregation === 'average') {
            const avg = getAveragePrice(priceHistory);
            return res.json({ averageStockPrice: avg, priceHistory });
        } else {
            return res.status(400).json({ error: "Only 'average' aggregation is supported" });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch stock data', details: err.message });
    }
});

// Route 2: Correlation API
app.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker } = req.query;

    if (!minutes || isNaN(minutes)) {
        return res.status(400).json({ error: "Invalid or missing 'minutes' parameter" });
    }

    if (!ticker || !Array.isArray(ticker) || ticker.length !== 2) {
        return res.status(400).json({ error: "Provide exactly two tickers as query parameters" });
    }

    try {
        const [ticker1, ticker2] = ticker;
        const [data1, data2] = await Promise.all([
            getStockPrices(ticker1, minutes),
            getStockPrices(ticker2, minutes),
        ]);
        console.log("gkajdsgadg")
        const correlation = calculateCorrelation(data1, data2);
        console.log(correlation,"gkjdshgksd")
        return res.json({
            correlation,
            [ticker1]: {
                averagePrice: getAveragePrice(data1),
                priceHistory: data1
            },
            [ticker2]: {
                averagePrice: getAveragePrice(data2),
                priceHistory: data2
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch or process stock data', details: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
