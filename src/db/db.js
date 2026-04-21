const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "insighta",
  password: "Akinjise",
  port: 5432,
});

module.exports = pool;