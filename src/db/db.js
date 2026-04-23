const { Pool } = require("pg");
require("dotenv").config();

console.log("DB URL:", process.env.DATABASE_URL); // DEBUG

const pool = new Pool({
  connectionString: String(process.env.DATABASE_URL)
});

module.exports = pool;