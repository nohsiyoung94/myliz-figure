// /api/reels
import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET /api/reels — 영상 후기 목록 조회 (order 순)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM reels ORDER BY "order"');
    res.json(rows);
  } catch { res.status(500).json({ error: "DB error" }); }
});

// POST /api/reels — 영상 후기 추가
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title = "", caption = "", thumbnail = "", video = "", href = "" } = req.body;
    const { rows: [{ count }] } = await pool.query("SELECT COUNT(*) FROM reels");
    const { rows: [reel] } = await pool.query(
      'INSERT INTO reels (title, caption, thumbnail, video, href, "order") VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, caption, thumbnail, video, href, Number(count)]
    );
    res.status(201).json(reel);
  } catch { res.status(500).json({ error: "DB error" }); }
});

// PUT /api/reels/:id — 영상 후기 수정
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, caption, thumbnail, video, href } = req.body;
    const { rows: [reel] } = await pool.query(
      `UPDATE reels SET
        title = COALESCE($1, title),
        caption = COALESCE($2, caption),
        thumbnail = COALESCE($3, thumbnail),
        video = COALESCE($4, video),
        href = COALESCE($5, href)
      WHERE id = $6 RETURNING *`,
      [title, caption, thumbnail, video, href, Number(req.params.id)]
    );
    if (!reel) { res.status(404).json({ error: "Not found" }); return; }
    res.json(reel);
  } catch { res.status(500).json({ error: "DB error" }); }
});

// DELETE /api/reels/:id — 영상 후기 삭제
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM reels WHERE id = $1", [Number(req.params.id)]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "DB error" }); }
});

// PATCH /api/reels/reorder — 영상 순서 변경
router.patch("/reorder", async (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < ids.length; i++) {
      await client.query('UPDATE reels SET "order" = $1 WHERE id = $2', [i, ids[i]]);
    }
    await client.query("COMMIT");
    const { rows } = await client.query('SELECT * FROM reels ORDER BY "order"');
    res.json(rows);
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Reorder failed" });
  } finally {
    client.release();
  }
});

export default router;
