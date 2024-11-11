const net = require("net");
const { performance } = require("perf_hooks");

class PortScannerService {
    constructor() {
        this.timeout = 1000;
    }

    async scanPort(host, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();

            socket.setTimeout(this.timeout);

            socket.connect(port, host, () => {
                resolve({
                    port,
                    state: 'open',
                    openedAt: new Date()
                });
                socket.destroy();
            });

            socket.on('timeout', () => {
                resolve({
                    port,
                    state: 'filtered',
                    openedAt: new Date()
                });
                socket.destroy();
            });

            socket.on('error', () => {
                resolve({
                    port,
                    state: 'closed',
                    openedAt: new Date()
                });
                socket.destroy();
            });
        });
    }

    async scanPortRange(host, startPort = 1, endPort = 1024) {

        if (!host) {
            throw new Error('Host is required');
        }

        if (typeof startPort !== 'number' || typeof endPort !== 'number') {
            throw new Error('Start and end ports must be numbers');
        }

        if (startPort > endPort) {
            throw new Error('Start port must be less than or equal to end port');
        }

        const start = performance.now();
        const scanPromises = [];

        try {
            const maxPorts = 100;
            const actualEndPorts = Math.min(endPort, startPort + maxPorts);



            for (let port = startPort; port <= endPort; port++) {
                scanPromises.push(this.scanPort(host, port));
            }


            const results = await Promise.allSettled(scanPromises);

            const openPorts = results
                .filter(result =>
                    result.status === 'fulfilled' &&
                    result.value.state === 'open'
                )
                .map(result => result.value);

            const end = performance.now();

            return {
                openPorts: openPorts,
                totalTime: end - start,
                scannedPorts: results.length
            };

        } catch (err) {
            console.error('Scan error:', err);
            throw new Error(`Scan failed: ${err.message}`);
        }
    }
}

module.exports = new PortScannerService();