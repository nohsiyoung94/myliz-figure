// /api/products
import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

const mapProduct = (row: Record<string, unknown>) => {
  const { badge_color, ...rest } = row;
  return { ...rest, badgeColor: badge_color };
};

// GET /api/products — 제품 목록 조회 (order 순)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY "order"');
    res.json(rows.map(mapProduct));
  } catch { res.status(500).json({ error: "DB error" }); }
});

// POST /api/products — 제품 추가
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name = "", desc = "", price = "", category = "figure",
      image = "", badge = "", badgeColor = "", rating = 0, reviews = 0,
    } = req.body;
    const { rows: [{ count }] } = await pool.query("SELECT COUNT(*) FROM products");
    const { rows: [item] } = await pool.query(
      `INSERT INTO products (name, "desc", price, category, image, badge, badge_color, rating, reviews, "order")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, desc, price, category, image, badge, badgeColor, Number(rating), Number(reviews), Number(count)]
    );
    res.status(201).json(mapProduct(item));
  } catch { res.status(500).json({ error: "DB error" }); }
});

// PUT /api/products/:id — 제품 수정
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, desc, price, category, image, badge, badgeColor, rating, reviews } = req.body;
    const { rows: [item] } = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        "desc" = COALESCE($2, "desc"),
        price = COALESCE($3, price),
        category = COALESCE($4, category),
        image = COALESCE($5, image),
        badge = COALESCE($6, badge),
        badge_color = COALESCE($7, badge_color),
        rating = COALESCE($8, rating),
        reviews = COALESCE($9, reviews)
      WHERE id = $10 RETURNING *`,
      [name, desc, price, category, image, badge, badgeColor, rating, reviews, Number(req.params.id)]
    );
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(mapProduct(item));
  } catch { res.status(500).json({ error: "DB error" }); }
});

// DELETE /api/products/:id — 제품 삭제
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [Number(req.params.id)]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "DB error" }); }
});

// PATCH /api/products/reorder — 제품 순서 변경
router.patch("/reorder", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < ids.length; i++) {
      await client.query('UPDATE products SET "order" = $1 WHERE id = $2', [i, ids[i]]);
    }
    await client.query("COMMIT");
    const { rows } = await client.query('SELECT * FROM products ORDER BY "order"');
    res.json(rows.map(mapProduct));
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
});

export default router;
