import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      subtitle TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      href TEXT NOT NULL DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      "desc" TEXT NOT NULL DEFAULT '',
      price TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'figure',
      image TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT '',
      badge_color TEXT NOT NULL DEFAULT '',
      rating NUMERIC NOT NULL DEFAULT 0,
      reviews INTEGER NOT NULL DEFAULT 0,
      "order" INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      size TEXT NOT NULL DEFAULT 'square',
      "order" INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS reels (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      caption TEXT NOT NULL DEFAULT '',
      thumbnail TEXT NOT NULL DEFAULT '',
      video TEXT NOT NULL DEFAULT '',
      href TEXT NOT NULL DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      handle TEXT NOT NULL DEFAULT '',
      avatar TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL DEFAULT 5,
      text TEXT NOT NULL DEFAULT '',
      product TEXT NOT NULL DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT '',
      size TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      read BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export default pool;
