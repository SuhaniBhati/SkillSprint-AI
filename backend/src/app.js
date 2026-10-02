const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillSprint AI backend is running",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
    });
});

// Existing API routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;

