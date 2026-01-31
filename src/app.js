const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const errorHandler = require("./middleware/errorMiddleware");

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

// Base API route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "IMS Backend API is running",
  });
});

// Error Middleware (Must be the last app.use)
app.use(errorHandler); //

module.exports = app;