// const net = require("net");
// const { Command } = require("commander");
// const program = new Command();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const DatabaseConnection = require("./config/database");

const scanRoutes = require("./routes/scanRoutes");

class NetworkScanner {
    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.connectDatabase();
        this.initializeRoutes();
    }

    initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
    }

    async connectDatabase() {
        await DatabaseConnection.connect();
    }

    initializeRoutes() {
        this.app.use('/api/scans', scanRoutes);
    }

    start(port = 8081) {
        this.app.listen(port, () => {
            console.log(`network port scanner runnig on port ${port}`);
        });
    }
}

const scanner = new NetworkScanner();
scanner.start(process.env.PORT);





// function scanPort(ip, port, timeout = 1000) {
//     return new Promise((resolve) => {
//         const socket = new net.Socket();
//         socket.setTimeout(timeout);

//         socket.on('connect', () => {
//             socket.destroy();
//             resolve({ ip, port, status: 'open' });
//         });

//         socket.on('timeout', () => {
//             socket.destroy();
//             resolve({ ip, port, status: 'closed' });
//         });

//         socket.on('error', () => {
//             resolve({ ip, port, status: 'closed' });
//         });

//         socket.connect(port, ip);
//     });
// }

// async function scanPortsConcurrently(ip, portRange, timeout, concurrency = 100) {
//     const results = [];
//     const promises = [];

//     for (let port = portRange.start; port <= portRange.end; port++) {
//         promises.push(scanPort(ip, port, timeout));

//         if (promises.length >= concurrency) {
//             results.push(...await Promise.all(promises));
//             promises.length = 0;
//         }
//     }

//     if (promises.length > 0) {
//         results.push(...await Promise.all(promises));
//     }

//     return results;
// }

// program
//     .option('-i, --ip <ip>', 'IP address to scan')
//     .option('-p, --ports <start-end>', 'Port range to scan (e.g., 20-80)')
//     .option('-t, --timeout <ms>', 'Timeout in milliseconds', 1000)
//     .option('-c, --concurrency <n>', 'Number of concurrent scans', 100)
//     .action(async () => {
//         const ip = program.opts().ip;
//         const [start, end] = program.opts().ports.split('-').map(Number);
//         const timeout = Number(program.opts().timeout);
//         const concurrency = Number(program.opts().concurrency);

//         const results = await scanPortsConcurrently(ip, { start, end }, timeout, concurrency);
//         console.log(results);
//     });

// program.parse(process.argv);