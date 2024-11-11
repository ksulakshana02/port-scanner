const express = require("express");
const ScanController = require("../controllers/scanController");

const router = express.Router();

router.post('/create', ScanController.createScan);
router.get('/results', ScanController.getScanResults);

module.exports = router;