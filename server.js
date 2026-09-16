require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// Demo credentials for college project
const DEMO_EMAIL = "student@cloudportal.com";
const DEMO_PASSWORD = "student123";

const JWT_SECRET =
    process.env.JWT_SECRET || "CloudStudentPortal_Demo_Secret_2026";

// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    if (email.trim() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            email: DEMO_EMAIL,
            name: "Cloud Student",
            role: "student"
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        success: true,
        message: "Login successful",
        token: token
    });
});

// Authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    const token = authHeader.substring(7);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired login session"
        });
    }
}

// Student information
app.get("/api/me", authenticateToken, (req, res) => {
    res.json({
        success: true,
        student: {
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            studentId: "CSP2026-001",
            course: "Cloud Computing",
            application: "Cloud Student Portal"
        }
    });
});

// Health
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        application: "Cloud Student Portal",
        status: "Running",
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString()
    });
});

// Info
app.get("/api/info", (req, res) => {
    res.json({
        application: "Cloud Student Portal",
        version: "2.0.0",
        technology: "Node.js + Express",
        security: "Helmet + JWT Authentication",
        cloudReady: true
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Page or API endpoint not found"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cloud Student Portal running on port ${PORT}`);
});
