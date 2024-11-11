const Scan = require("../model/Scan");
const portScannerService = require("../services/portScannerService");

class ScanController {
    async createScan(req, res) {
        const { target, startPort, endPort } = req.body;

        if (!target) {
            return res.status(400).json({
                message: 'Target host is required'
            });
        }

        const scan = new Scan({
            target,
            startPort: startPort || 1,
            endPort: endPort || 1024
        });

        try {
            const scanResults = await portScannerService.scanPortRange(
                target,
                scan.startPort,
                scan.endPort
            );

            scan.openPorts = Array.isArray(scanResults.openPorts)
                ? scanResults.openPorts
                : [];

            scan.openPorts = scanResults.openPorts;
            scan.endTime = new Date();
            scan.duration = scanResults.totalTime;
            scan.status = 'completed';

            await scan.save();

            res.status(201).json(scan);

        } catch (err) {
            console.error('Scan creation error:', err);

            scan.status = 'failed';
            await scan.save();

            res.status(500).json({
                message: 'Scan failed',
                error: err.message,
            });
        }
    }

    async getScanResults(req, res) {
        try {
            const scans = await Scan.find().sort({ startTime: -1 });
            res.json(scans);
        } catch (err) {
            console.error('Get scan results error:', err);
            res.status(500).json({ message: "Error retrieving scans", error: err.message });
        }
    }
}

module.exports = new ScanController();

