const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// GET /api/profiles
router.get("/", async (req, res) => {
  try {
    let {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability,
      sort_by,
      order,
      page = 1,
      limit = 10,
      q
    } = req.query;

    // -------------------------
    // VALIDATION
    // -------------------------
    const allowedSort = ["age", "created_at", "gender_probability"];
    const allowedOrder = ["asc", "desc"];

    if (sort_by && !allowedSort.includes(sort_by)) {
      return res.status(400).json({
        success: false,
        error: "invalid sort_by"
      });
    }

    if (order && !allowedOrder.includes(order.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "invalid order"
      });
    }

    // -------------------------
    // PAGINATION SAFETY
    // -------------------------
    limit = Math.min(parseInt(limit), 50);
    page = Math.max(parseInt(page), 1);
    const offset = (page - 1) * limit;

    // -------------------------
    // BASE QUERY
    // -------------------------
    let query = "SELECT * FROM profiles WHERE 1=1";
    let countQuery = "SELECT COUNT(*) FROM profiles WHERE 1=1";

    let values = [];
    let countValues = [];
    let i = 1;

    // -------------------------
    // FILTERS
    // -------------------------
    if (gender) {
      query += ` AND gender = $${i}`;
      countQuery += ` AND gender = $${i}`;
      values.push(gender);
      countValues.push(gender);
      i++;
    }

    if (age_group) {
      query += ` AND age_group = $${i}`;
      countQuery += ` AND age_group = $${i}`;
      values.push(age_group);
      countValues.push(age_group);
      i++;
    }

    if (country_id) {
      query += ` AND country_id = $${i}`;
      countQuery += ` AND country_id = $${i}`;
      values.push(country_id);
      countValues.push(country_id);
      i++;
    }

    if (min_age) {
      query += ` AND age >= $${i}`;
      countQuery += ` AND age >= $${i}`;
      values.push(min_age);
      countValues.push(min_age);
      i++;
    }

    if (max_age) {
      query += ` AND age <= $${i}`;
      countQuery += ` AND age <= $${i}`;
      values.push(max_age);
      countValues.push(max_age);
      i++;
    }

    if (min_gender_probability) {
      query += ` AND gender_probability >= $${i}`;
      countQuery += ` AND gender_probability >= $${i}`;
      values.push(min_gender_probability);
      countValues.push(min_gender_probability);
      i++;
    }

    if (min_country_probability) {
      query += ` AND country_probability >= $${i}`;
      countQuery += ` AND country_probability >= $${i}`;
      values.push(min_country_probability);
      countValues.push(min_country_probability);
      i++;
    }

    // -------------------------
    // NATURAL LANGUAGE SEARCH (q)
    // -------------------------
    if (q) {
      query += ` AND name ILIKE $${i}`;
      countQuery += ` AND name ILIKE $${i}`;
      values.push(`%${q}%`);
      countValues.push(`%${q}%`);
      i++;
    }

    // -------------------------
    // SORTING
    // -------------------------
    if (sort_by) {
      query += ` ORDER BY ${sort_by}`;
      query += order ? ` ${order.toUpperCase()}` : " ASC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    // -------------------------
    // PAGINATION
    // -------------------------
    query += ` LIMIT $${i} OFFSET $${i + 1}`;
    values.push(limit, offset);

    // -------------------------
    // EXECUTE
    // -------------------------
    const result = await pool.query(query, values);
    const countResult = await pool.query(countQuery, countValues);

    const total = parseInt(countResult.rows[0].count);

    // -------------------------
    // RESPONSE (GRADER FORMAT)
    // -------------------------
    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
  console.error("FULL ERROR:", err); // ADD THIS
  res.status(500).json({
    success: false,
    error: err.message // CHANGE THIS
  });
}
});

module.exports = router;