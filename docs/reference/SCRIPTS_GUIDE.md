# Scripts Guide

Reference for all data generation and seed scripts in the UBIS project.

## Quick Reference

| Script | Location | Purpose | Required DB |
|--------|----------|---------|-------------|
| `seed.js` | `server/` | Base data: admin user, courses, announcements | MongoDB ✅ |
| `import-students-simple.js` | `server/` | Import test student accounts | MongoDB ✅ |
| `import-students.js` | `server/` | Full student import with detailed data | MongoDB ✅ |
| `seed-real-data.js` | `server/` | Seed realistic production-like data | MongoDB ✅ |

---

## Seed Scripts (server/)

### seed.js

Creates the initial admin user, course catalog, and sample announcements.

```bash
cd server
node seed.js
```

**Creates:**
- Admin user (`admin` / password from `SEED_PASSWORD` env var)
- Base course catalog
- Sample announcements
- Academic calendar entries

> **Note:** Safe to run multiple times — checks for existing data before creating.

---

### import-students-simple.js

Imports a small set of test student accounts for development.

```bash
cd server
node import-students-simple.js
```

**Creates:**
- Test student accounts (e.g., `B211200051`)
- Default password: `SEED_PASSWORD` env var (default: `ChangeMe!123`)

---

### import-students.js

Full student import with detailed profile data (faculty, department, GPA, etc.).

```bash
cd server
node import-students.js
```

---

### seed-real-data.js

Seeds realistic production-like data for demo or presentation purposes.

```bash
cd server
node seed-real-data.js
```

---

## Data Generation Scripts (scripts/)

These scripts generate mock data JSON files or populate the database with large datasets. All located in the `scripts/` directory.

### Student Data

| Script | Size | Description |
|--------|------|-------------|
| `generate-students.js` | 13KB | Generate student profiles with faculties, GPAs, contact info |
| `enrich-student-data.js` | 7KB | Add additional fields to existing student records |
| `enrich-student-data-v2.js` | 8KB | Version 2: Enhanced enrichment with grades |
| `enrich-student-data-v3.js` | 6KB | Version 3: Add attendance data |
| `enrich-student-data-v4.js` | 6KB | Version 4: Add payment/financial data |
| `enrich-student-data-v5.js` | 6KB | Version 5: Add dormitory/campus data |

### Academic Data

| Script | Size | Description |
|--------|------|-------------|
| `generate-courses.js` | 7KB | Generate course catalog with codes, credits, ECTS |
| `generate-program-courses.js` | 18KB | Generate full department program course maps |
| `generate-staff.js` | 12KB | Generate academic staff profiles |

### Campus Data

| Script | Size | Description |
|--------|------|-------------|
| `generate-campus.js` | 7KB | Generate campus building and location data |
| `generate-campus-v2.js` | 6KB | Version 2: Enhanced campus data with coordinates |
| `generate-social-evidence.js` | 5KB | Generate social transcript/activity data |

### Database Utilities

| Script | Size | Description |
|--------|------|-------------|
| `generate-indices.js` | 5KB | Create/verify MongoDB indexes for all collections |
| `scaffold-data.js` | 8KB | Bootstrap full dataset (runs multiple generators) |

---

## Usage Patterns

### First-Time Setup

```bash
# 1. Ensure MongoDB is running
# 2. Seed base data
cd server && node seed.js

# 3. Import test students
node import-students-simple.js

# 4. (Optional) Generate rich mock data
cd ../scripts && node scaffold-data.js
```

### Docker Setup

```bash
# Seed inside running container
docker exec -it ubis_server node seed.js
docker exec -it ubis_server node import-students-simple.js
```

### Regenerate Indexes

```bash
cd scripts
node generate-indices.js
```

> This script creates compound indexes defined in the Mongoose models. Useful after bulk data operations or schema changes.
