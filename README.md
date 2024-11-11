# Network Port Scanner

A backend-only network port scanner built with Node.js and MongoDB.

## Features

- Scan a range of ports on a specified target
- Store scan results in MongoDB
- Basic error handling and logging

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/ksulakshana02/port-scanner.git
   cd port-scanner
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up your .env file
   ```bash
   PORT= 8081
   MONGODB_URI= <your_mongoDb_uri>
   ```
4. Start the server
   ```bash
   nodemon index.js
   ```
