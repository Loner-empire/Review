#!/usr/bin/env node
/**
 * Admin User Creation Script
 * Usage: node scripts/create-admin.js <email> <password> [role]
 * Example: node scripts/create-admin.js admin@youthsparkcareers.co.za mypassword superadmin
 */

const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const [, , email, password, role = "admin"] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.js <email> <password> [role]");
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO admin_users (email, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = $3
     RETURNING id, email, role`,
    [email, passwordHash, role]
  );

  console.log("Admin user created/updated:", result.rows[0]);
  await pool.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
