import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const DATA_FILE = path.join(__dirname, "../../data/reels.json");

interface Reel {
  id: number;
  title: string;
  caption: string;
  thumbnail: string;
  video: string;
  href: string;
  order: number;
}

function readReels(): Reel[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]");
      return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeReels(reels: Reel[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(reels, null, 2));
}

router.get("/", (_req: Request, res: Response) => {
  const reels = readReels().sort((a, b) => a.order - b.order);
  res.json(reels);
});

router.post("/", (req: Request, res: Response) => {
  const reels = readReels();
  const reel: Reel = {
    id: Date.now(),
    title: req.body.title ?? "",
    caption: req.body.caption ?? "",
    thumbnail: req.body.thumbnail ?? "",
    video: req.body.video ?? "",
    href: req.body.href ?? "",
    order: reels.length,
  };
  reels.push(reel);
  writeReels(reels);
  res.status(201).json(reel);
});

router.put("/:id", (req: Request, res: Response) => {
  const reels = readReels();
  const id = Number(req.params.id);
  const idx = reels.findIndex((r) => r.id === id);
  if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
  reels[idx] = { ...reels[idx], ...req.body, id };
  writeReels(reels);
  res.json(reels[idx]);
});

router.delete("/:id", (req: Request, res: Response) => {
  let reels = readReels();
  const id = Number(req.params.id);
  reels = reels.filter((r) => r.id !== id);
  reels.forEach((r, i) => { r.order = i; });
  writeReels(reels);
  res.json({ success: true });
});

router.patch("/reorder", (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const reels = readReels();
  const reordered = ids.map((id, i) => {
    const reel = reels.find((r) => r.id === id);
    if (!reel) return null;
    return { ...reel, order: i };
  }).filter(Boolean) as Reel[];
  writeReels(reordered);
  res.json(reordered);
});

export default router;
