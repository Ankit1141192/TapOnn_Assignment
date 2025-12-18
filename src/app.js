const express = require("express");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { sendError } = require("./utils/response");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use((req, res) => {
  res.status(404).json(sendError("Route not found"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(sendError("Internal server error", err.message));
});

module.exports = app;
