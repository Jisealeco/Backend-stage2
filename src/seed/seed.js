const fs = require("fs");
const path = require("path");
const pool = require("../db/db");
const { v7: uuidv7 } = require("uuid");

console.log("🔥 seed.js is running");

// STEP 1: Load JSON file
const filePath = path.join(__dirname, "profiles.json");
const rawData = fs.readFileSync(filePath, "utf-8");
const profiles = JSON.parse(rawData);

console.log("Total records:", profiles.length);

// STEP 2: Seed function
const seedDatabase = async () => {
  try {
    console.log("Seeding started...");

    const batchSize = 200;

    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);

      const values = [];
      const placeholders = [];

      batch.forEach((p, index) => {
        const base = index * 9;

        values.push(
          uuidv7(),
          p.name,
          p.gender,
          p.gender_probability,
          p.age,
          p.age_group,
          p.country_id,
          p.country_name,
          p.country_probability
        );

        placeholders.push(
          `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},NOW())`
        );
      });

      await pool.query(
        `
        INSERT INTO public.profiles (
          id,
          name,
          gender,
          gender_probability,
          age,
          age_group,
          country_id,
          country_name,
          country_probability,
          created_at
        )
        VALUES ${placeholders.join(",")}
        ON CONFLICT (id) DO NOTHING;
        `,
        values
      );

      console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    console.log("✅ Seeding complete");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();