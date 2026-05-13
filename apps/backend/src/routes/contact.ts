import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    res.json(rows);
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, type = "", size = "", message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "name, email, message는 필수입니다." });
      return;
    }
    const { rows: [contact] } = await pool.query(
      `INSERT INTO contacts (name, email, type, size, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, type, size, message]
    );
    res.status(201).json(contact);
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.patch("/:id/read", async (req: Request, res: Response) => {
  try {
    const { rows: [contact] } = await pool.query(
      "UPDATE contacts SET read = true WHERE id = $1 RETURNING *",
      [Number(req.params.id)]
    );
    if (!contact) { res.status(404).json({ error: "Not found" }); return; }
    res.json(contact);
  } catch { res.status(500).json({ error: "DB error" }); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM contacts WHERE id = $1", [Number(req.params.id)]);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "DB error" }); }
});

export default router;
