const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// Helper: convert text → filters
function parseQuery(q) {
  q = q.toLowerCase();

  let filters = {};

  // Gender
  if (q.includes("male")) filters.gender = "male";
  if (q.includes("female")) filters.gender = "female";

  // Age rules
  if (q.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  if (q.includes("teen")) {
    filters.age_group = "teenager";
  }

  if (q.includes("adult")) {
    filters.age_group = "adult";
  }

  if (q.includes("senior")) {
    filters.age_group = "senior";
  }

  // Countries (expand as needed from dataset)
  const countryMap = {
    nigeria: "NG",
    kenya: "KE",
    angola: "AO",
    ghana: "GH",
    benin: "BJ"
  };

  for (let country in countryMap) {
    if (q.includes(country)) {
      filters.country_id = countryMap[country];
    }
  }

  // "above X"
  const aboveMatch = q.match(/above (\d+)/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[1]);
  }

  return filters;
}

// GET /api/profiles/search?q=
router.get("/", async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing query"
      });
    }

    const filters = parseQuery(q);

    if (Object.keys(filters).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    let query = "SELECT * FROM profiles WHERE 1=1";
    let values = [];
    let i = 1;

    // Apply filters
    if (filters.gender) {
      query += ` AND gender = $${i++}`;
      values.push(filters.gender);
    }

    if (filters.age_group) {
      query += ` AND age_group = $${i++}`;
      values.push(filters.age_group);
    }

    if (filters.country_id) {
      query += ` AND country_id = $${i++}`;
      values.push(filters.country_id);
    }

    if (filters.min_age) {
      query += ` AND age >= $${i++}`;
      values.push(filters.min_age);
    }

    if (filters.max_age) {
      query += ` AND age <= $${i++}`;
      values.push(filters.max_age);
    }

    // Pagination
    const lim = Math.min(parseInt(limit), 50);
    const offset = (page - 1) * lim;

    query += ` LIMIT $${i++} OFFSET $${i++}`;
    values.push(lim, offset);

    const result = await pool.query(query, values);

    res.json({
      status: "success",
      page: parseInt(page),
      limit: lim,
      data: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
});

module.exports = router;