require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
let windowNumbers = [];

const BEARER_TOKEN = process.env.BEARER_TOKEN;

const apiMap = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand"
};

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

app.get('/numbers/:numberid', async (req, res) => {
  const id = req.params.numberid;
  const url = apiMap[id];

  if (!url) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const windowPrevState = [...windowNumbers];
  let newNumbers = [];

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      },
      timeout: 500
    });

    newNumbers = response.data.numbers || [];

    for (let num of newNumbers) {
      if (!windowNumbers.includes(num)) {
        if (windowNumbers.length >= WINDOW_SIZE) {
          windowNumbers.shift();
        }
        windowNumbers.push(num);
      }
    }

  } catch (error) {
    if (error.response) {
      console.error("Response error:", error.response.status, error.response.data);
    } else {
      console.error("Request error:", error.message);
    }
    newNumbers = [];
  }

  const average = calculateAverage(windowNumbers);

  res.json({
    windowPrevState,
    windowCurrState: windowNumbers,
    numbers: newNumbers,
    avg: average
  });
});

app.listen(port, () => {
  console.log(`Average Calculator Microservice running on http://localhost:${port}`);
});
