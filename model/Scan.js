const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema({
    target: {
        type: String,
        required: true,
    },
    startPort: {
        type: Number,
        default: 1,
    },
    endPort: {
        type: Number,
        default: 1024,
    },
    openPorts: [{
        port: Number,
        state: String,
        openedAt: Date
    }],
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: Date,
    duration: Number,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Scan', ScanSchema);