const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();

// const allowedOrigins = [
//     "http://localhost:5500",
//     "http://127.0.0.1:5500",
//     process.env.FRONTEND_URL
// ].filter(Boolean);
const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://mock-mate-five-rho.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/resume", require("./routes/resume.routes"));

app.use("/api/interview", require("./routes/interview.routes"));

app.use("/api/analysis", require("./routes/analysis.routes"));

app.get("/", (req, res) => {
    res.json({ message: "Mock Interview API is running" });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });
