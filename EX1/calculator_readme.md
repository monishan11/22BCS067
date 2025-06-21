# Average Calculator Microservice

A Node.js Express microservice that maintains a sliding window of numbers and calculates their average. It fetches numbers from different number sequence APIs (primes, fibonacci, even, random) and maintains a rolling window of unique numbers.

## Features

- **Sliding Window Management**: Maintains a window of up to 10 unique numbers
- **Multiple Number Types**: Supports primes, fibonacci, even numbers, and random numbers
- **Average Calculation**: Calculates the average of numbers in the current window
- **Timeout Handling**: 500ms timeout for external API calls
- **State Tracking**: Returns both previous and current window states

## Prerequisites

- Node.js
- npm
- A valid Bearer Token for the evaluation service

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express axios dotenv
   ```
3. Create a `.env` file in the root directory:
   ```
   BEARER_TOKEN=your_bearer_token_here
   ```

## Usage

Start the microservice:
```bash
node server.js
```

The service will run on `http://localhost:9876`

## API Endpoint

### Get Numbers and Calculate Average

**GET** `/numbers/:numberid`

**Parameters:**
- `numberid` (path): Type of numbers to fetch
  - `p` - Prime numbers
  - `f` - Fibonacci numbers  
  - `e` - Even numbers
  - `r` - Random numbers

**Example:**
```
GET /numbers/p
```

**Response:**
```json
{
  "windowPrevState": [2, 3, 5, 7, 11],
  "windowCurrState": [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
  "numbers": [13, 17, 19, 23, 29],
  "avg": 12.90
}
```

## Response Fields

- `windowPrevState`: Array of numbers in the window before the current request
- `windowCurrState`: Array of numbers in the window after processing the current request
- `numbers`: New numbers fetched from the API in the current request
- `avg`: Average of all numbers in the current window (rounded to 2 decimal places)

## Technical Details

- **Window Size**: Fixed at 10 numbers maximum
- **Duplicate Handling**: Only unique numbers are stored in the window
- **Timeout**: 500ms timeout for external API calls
- **Error Handling**: Continues operation even if external API fails
- **Port**: Default port 9876

## External APIs

The service connects to the following evaluation service endpoints:
- Primes: `http://20.244.56.144/evaluation-service/primes`
- Fibonacci: `http://20.244.56.144/evaluation-service/fibo`
- Even: `http://20.244.56.144/evaluation-service/even`
- Random: `http://20.244.56.144/evaluation-service/rand`

## Error Responses

- `400`: Invalid number ID parameter

## Environment Variables

- `BEARER_TOKEN`: Authentication token for the evaluation service

## Window Behavior

1. Numbers are fetched from the specified API
2. Only unique numbers are added to the window
3. If the window reaches capacity (10 numbers), the oldest number is removed
4. Average is calculated from all numbers currently in the window