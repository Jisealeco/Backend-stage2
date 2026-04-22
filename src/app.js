const express = require("express");
const app = express();
const pool = require("./db/db");
const profileRoutes = require("./routes/profiles");
const searchRoutes = require("./routes/search");

app.use(express.json());

// CORS (REQUIRED)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/profiles", profileRoutes);
app.use("/api/profiles/search", searchRoutes);

if (require.main === module) {
  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
}

module.exports = app;