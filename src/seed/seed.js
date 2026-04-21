const fs = require("fs");
const path = require("path");
const pool = require("../db/db");
const { v7: uuidv7 } = require("uuid");

console.log("🔥 seed.js is running");

// STEP 1: define file path FIRST
const filePath = path.join(__dirname, "profiles.json");

// STEP 2: read file
const rawData = fs.readFileSync(filePath, "utf-8");

// STEP 3: parse JSON
const profiles = JSON.parse(rawData);

console.log("Total records:", profiles.length);

const seedDatabase = async () => {
  try {
    console.log("Seeding started...");

    for (const profile of profiles) {
      await pool.query(
        `
        INSERT INTO profiles (
          id, name, gender, gender_probability,
          age, age_group,
          country_id, country_name, country_probability,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
        ON CONFLICT (name) DO NOTHING;
        `,
        [
          uuidv7(),
          profile.name,
          profile.gender,
          profile.gender_probability,
          profile.age,
          profile.age_group,
          profile.country_id,
          profile.country_name,
          profile.country_probability
        ]
      );
    }

    console.log("✅ Seeding complete");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();