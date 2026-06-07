import mongoose from "mongoose";

export const connectDB = async () => {
    // console.log("URI:", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("hogya connection:Connected to MongoDB!!!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};