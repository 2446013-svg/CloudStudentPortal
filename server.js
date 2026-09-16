require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");

const app = express();

// Basic security middleware
app.use(helmet());

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check API
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        application: "Cloud Student Portal",
        status: "Running",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

// Application information API
app.get("/api/info", (req, res) => {
    res.json({
        application: "Cloud Student Portal",
        version: "1.0.0",
        technology: "Node.js + Express",
        security: "Helmet",
        cloudReady: true
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Page or API endpoint not found"
    });
});

// Cloud platforms provide PORT through environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cloud Student Portal running on port ${PORT}`);
});
