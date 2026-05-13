import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM reviews ORDER BY "order"');
    res.json(rows);
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name = "", handle = "", avatar = "", rating = 5, text = "", product = "" } = req.body;
    const { rows: [{ count }] } = await pool.query("SELECT COUNT(*) FROM reviews");
    const { rows: [review] } = await pool.query(
      `INSERT INTO reviews (name, handle, avatar, rating, text, product, "order")
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, handle, avatar, Number(rating), text, product, Number(count)]
    );
    res.status(201).json(review);
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, handle, avatar, rating, text, product } = req.body;
    const { rows: [review] } = await pool.query(
      `UPDATE reviews SET
        name = COALESCE($1, name),
        handle = COALESCE($2, handle),
        avatar = COALESCE($3, avatar),
        rating = COALESCE($4, rating),
        text = COALESCE($5, text),
        product = COALESCE($6, product)
       WHERE id = $7 RETURNING *`,
      [name, handle, avatar, rating, text, product, Number(req.params.id)]
    );
    if (!review) { res.status(404).json({ error: "Not found" }); return; }
    res.json(review);
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM reviews WHERE id = $1", [Number(req.params.id)]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.patch("/reorder", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < ids.length; i++) {
      await client.query('UPDATE reviews SET "order" = $1 WHERE id = $2', [i, ids[i]]);
    }
    await client.query("COMMIT");
    const { rows } = await client.query('SELECT * FROM reviews ORDER BY "order"');
    res.json(rows);
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
});

export default router;
