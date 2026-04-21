# Insighta Labs - Intelligence Query Engine API

## 📌 Overview
This project is a backend API built for Insighta Labs to manage and query demographic intelligence data. It supports advanced filtering, sorting, pagination, and natural language search over a dataset of user profiles.

---

## 🚀 Features

### 1. Profile Management
- Stores 2026 user profiles
- Each profile contains:
  - name
  - gender
  - age
  - age_group
  - country information
  - probability scores
  - timestamp

---

### 2. Advanced Filtering
Supports filtering by:
- gender
- age_group
- country_id
- min_age / max_age
- min_gender_probability
- min_country_probability

---

### 3. Sorting
Profiles can be sorted by:
- age
- created_at
- gender_probability

Order:
- ascending (asc)
- descending (desc)

---

### 4. Pagination
- page (default: 1)
- limit (default: 10, max: 50)

---

### 5. Natural Language Search
Endpoint:
GET /api/profiles/search?q=

#### Examples:
- "young males from nigeria"
- "females above 30"
- "adult males in kenya"

---

## 🧠 Natural Language Parsing Approach

This project uses a **rule-based parsing system (no AI/LLM used)**.

### Keyword Mapping:

| Input Keyword | Meaning |
|------|--------|
| young | age 16–24 |
| male | gender = male |
| female | gender = female |
| teenager | age_group = teenager |
| adult | age_group = adult |
| senior | age_group = senior |
| country names | mapped to ISO country codes |

### Logic:
1. Convert query to lowercase
2. Match keywords using string includes
3. Extract numeric conditions (e.g., "above 30")
4. Convert into SQL filters
5. Execute database query

---

## ⚠️ Limitations

- Does not support advanced grammar parsing
- Limited country dictionary (predefined mappings only)
- Cannot interpret complex sentences
- No AI/ML used (rule-based only)
- Typos in queries are not handled

---

## 🗄️ Database Schema

Table: `profiles`

- id (UUID v7)
- name (VARCHAR, UNIQUE)
- gender (VARCHAR)
- gender_probability (FLOAT)
- age (INT)
- age_group (VARCHAR)
- country_id (VARCHAR 2)
- country_name (VARCHAR)
- country_probability (FLOAT)
- created_at (TIMESTAMP)

---

## 🔗 API Endpoints

### Get All Profiles

GET /api/profiles

Supports filtering, sorting, pagination.

---

### Search Profiles

GET /api/profiles/search?q=

Supports natural language queries.

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- UUID v7
- Raw SQL queries

---

## 📦 Setup Instructions

1. Clone repository
2. Install dependencies

npm install
3. Setup PostgreSQL database
4. Run schema creation
5. Seed database

node src/seed/seed.js
6. Start server

npm run dev


---

## 📊 Performance Considerations

- Parameterized queries used for security
- Pagination limits enforced (max 50)
- ON CONFLICT used to prevent duplicates
- Efficient filtering with SQL conditions

## 👨‍💻 Author
Alex