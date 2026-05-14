// /api/gallery
import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET /api/gallery — 갤러리 목록 조회 (order 순)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM gallery ORDER BY "order"');
    res.json(rows);
  } catch { res.status(500).json({ error: "DB error" }); }
});

// POST /api/gallery — 갤러리 이미지 추가
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title = "", image = "", size = "square" } = req.body;
    const { rows: [{ count }] } = await pool.query("SELECT COUNT(*) FROM gallery");
    const { rows: [item] } = await pool.query(
      'INSERT INTO gallery (title, image, size, "order") VALUES ($1,$2,$3,$4) RETURNING *',
      [title, image, size, Number(count)]
    );
    res.status(201).json(item);
  } catch { res.status(500).json({ error: "DB error" }); }
});

// PUT /api/gallery/:id — 갤러리 이미지 수정
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, image, size } = req.body;
    const { rows: [item] } = await pool.query(
      `UPDATE gallery SET
        title = COALESCE($1, title),
        image = COALESCE($2, image),
        size = COALESCE($3, size)
      WHERE id = $4 RETURNING *`,
      [title, image, size, Number(req.params.id)]
    );
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(item);
  } catch { res.status(500).json({ error: "DB error" }); }
});

// DELETE /api/gallery/:id — 갤러리 이미지 삭제
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [Number(req.params.id)]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "DB error" }); }
});

// PATCH /api/gallery/reorder — 갤러리 순서 변경
router.patch("/reorder", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < ids.length; i++) {
      await client.query('UPDATE gallery SET "order" = $1 WHERE id = $2', [i, ids[i]]);
    }
    await client.query("COMMIT");
    const { rows } = await client.query('SELECT * FROM gallery ORDER BY "order"');
    res.json(rows);
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
});

export default router;
