// /api/banners
import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET /api/banners — 배너 목록 조회 (order 순)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM banners ORDER BY "order"');
    res.json(rows);
  } catch (err) { console.error("banners route error:", err); res.status(500).json({ error: "DB error" }); }
});

// POST /api/banners — 배너 추가
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title = "", subtitle = "", image = "", href = "" } = req.body;
    const { rows: [{ count }] } = await pool.query("SELECT COUNT(*) FROM banners");
    const { rows: [banner] } = await pool.query(
      'INSERT INTO banners (title, subtitle, image, href, "order") VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, subtitle, image, href, Number(count)]
    );
    res.status(201).json(banner);
  } catch (err) { console.error("banners route error:", err); res.status(500).json({ error: "DB error" }); }
});

// PUT /api/banners/:id — 배너 수정
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, subtitle, image, href } = req.body;
    const { rows: [banner] } = await pool.query(
      `UPDATE banners SET
        title = COALESCE($1, title),
        subtitle = COALESCE($2, subtitle),
        image = COALESCE($3, image),
        href = COALESCE($4, href)
      WHERE id = $5 RETURNING *`,
      [title, subtitle, image, href, Number(req.params.id)]
    );
    if (!banner) { res.status(404).json({ error: "Not found" }); return; }
    res.json(banner);
  } catch (err) { console.error("banners route error:", err); res.status(500).json({ error: "DB error" }); }
});

// DELETE /api/banners/:id — 배너 삭제
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM banners WHERE id = $1", [Number(req.params.id)]);
    res.json({ success: true });
  } catch (err) { console.error("banners route error:", err); res.status(500).json({ error: "DB error" }); }
});

// PATCH /api/banners/reorder — 배너 순서 변경
router.patch("/reorder", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < ids.length; i++) {
      await client.query('UPDATE banners SET "order" = $1 WHERE id = $2', [i, ids[i]]);
    }
    await client.query("COMMIT");
    const { rows } = await client.query('SELECT * FROM banners ORDER BY "order"');
    res.json(rows);
  } catch (err) {
    console.error("banners reorder error:", err);
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
});

export default router;
