import express from 'express';
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { default: connectDB } = await import("./db.cjs"); // Dynamisk import for CommonJS

// Koble til MongoDB
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
    res.send("🚀 API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
