import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const DATA_FILE = path.join(__dirname, "../../data/banners.json");

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  order: number;
}

function readBanners(): Banner[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) { fs.writeFileSync(DATA_FILE, "[]"); return []; }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch { return []; }
}

function writeBanners(banners: Banner[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(banners, null, 2));
}

router.get("/", (_req: Request, res: Response) => {
  res.json(readBanners().sort((a, b) => a.order - b.order));
});

router.post("/", (req: Request, res: Response) => {
  const banners = readBanners();
  const banner: Banner = {
    id: Date.now(),
    title: req.body.title ?? "",
    subtitle: req.body.subtitle ?? "",
    image: req.body.image ?? "",
    href: req.body.href ?? "",
    order: banners.length,
  };
  banners.push(banner);
  writeBanners(banners);
  res.status(201).json(banner);
});

router.put("/:id", (req: Request, res: Response) => {
  const banners = readBanners();
  const id = Number(req.params.id);
  const idx = banners.findIndex((b) => b.id === id);
  if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
  banners[idx] = { ...banners[idx], ...req.body, id };
  writeBanners(banners);
  res.json(banners[idx]);
});

router.delete("/:id", (req: Request, res: Response) => {
  let banners = readBanners();
  banners = banners.filter((b) => b.id !== Number(req.params.id));
  banners.forEach((b, i) => { b.order = i; });
  writeBanners(banners);
  res.json({ success: true });
});

router.patch("/reorder", (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const banners = readBanners();
  const reordered = ids.map((id, i) => {
    const b = banners.find((x) => x.id === id);
    if (!b) return null;
    return { ...b, order: i };
  }).filter(Boolean) as Banner[];
  writeBanners(reordered);
  res.json(reordered);
});

export default router;
