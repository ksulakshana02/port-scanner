const mongoose = require("mongoose");
require('dotenv').config();

class DatabaseConnection {
    static async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected successfully!');
        } catch (err) {
            console.error("mogoDb connection error: ", err);
            process.exit(1);
        }
    }

    static async disconnect() {
        await mongoose.connection.close();
    }
}

module.exports = DatabaseConnection;