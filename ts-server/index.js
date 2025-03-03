import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import MongoDB connection function

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
    res.send("🚀 API is running...");
});

// Set port from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
