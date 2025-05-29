import mongoose from 'mongoose';
import { DB_NAME } from '../constant/index.js';
export const connectDB = async () => {
    try {
        const dbConnecttion = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected and HOST at: ${dbConnecttion.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // Only attempt to close the connection if it was established
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("MongoDB Connection Closed");
        }
        process.exit(1); // Exit the process on failure
    }
};

// Gracefully handle application termination
process.on('SIGINT', async () => {
    console.log("Application is terminating...");
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("MongoDB Connection Closed");
    }
    process.exit(0);
});