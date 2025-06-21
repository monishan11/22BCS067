# Stock Price API Server

A Node.js Express server that provides stock price analysis and correlation calculations using external stock data.

## Features

- **Average Stock Price Calculation**: Get average stock prices over specified time periods
- **Stock Correlation Analysis**: Calculate Pearson correlation between two stocks
- **Caching**: Built-in caching system to optimize API calls
- **Error Handling**: Comprehensive error handling for invalid requests

## Prerequisites

- Node.js
- npm
- A valid Bearer Token for the stock evaluation service

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express axios node-cache dotenv
   ```
3. Create a `.env` file in the root directory:
   ```
   BEARER_TOKEN=your_bearer_token_here
   ```

## Usage

Start the server:
```bash
node server.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Get Average Stock Price

**GET** `/stocks/:ticker`

**Parameters:**
- `ticker` (path): Stock ticker symbol
- `minutes` (query): Time period in minutes
- `aggregation` (query): Must be "average"

**Example:**
```
GET /stocks/AAPL?minutes=60&aggregation=average
```

**Response:**
```json
{
  "averageStockPrice": 150.25,
  "priceHistory": [...]
}
```

### 2. Get Stock Correlation

**GET** `/stockcorrelation`

**Parameters:**
- `minutes` (query): Time period in minutes
- `ticker` (query): Array of exactly two ticker symbols

**Example:**
```
GET /stockcorrelation?minutes=60&ticker=AAPL&ticker=GOOGL
```

**Response:**
```json
{
  "correlation": 0.8542,
  "AAPL": {
    "averagePrice": 150.25,
    "priceHistory": [...]
  },
  "GOOGL": {
    "averagePrice": 2750.80,
    "priceHistory": [...]
  }
}
```

## Technical Details

- **Caching**: Responses are cached for 60 seconds to reduce API calls
- **Correlation Algorithm**: Uses Pearson correlation coefficient
- **External API**: Connects to `http://20.244.56.144/evaluation-service/stocks`
- **Port**: Default port 3000

## Error Responses

- `400`: Invalid or missing parameters
- `500`: Server error or external API failure

## Environment Variables

- `BEARER_TOKEN`: Authentication token for the stock evaluation service