import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const DATA_FILE = path.join(__dirname, "../../data/products.json");

interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
  category: string;
  image: string;
  badge: string;
  badgeColor: string;
  rating: number;
  reviews: number;
  order: number;
}

function read(): Product[] {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) { fs.writeFileSync(DATA_FILE, "[]"); return []; }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch { return []; }
}

function write(items: Product[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

router.get("/", (_req: Request, res: Response) => {
  res.json(read().sort((a, b) => a.order - b.order));
});

router.post("/", (req: Request, res: Response) => {
  const items = read();
  const item: Product = {
    id: Date.now(),
    name: req.body.name ?? "",
    desc: req.body.desc ?? "",
    price: req.body.price ?? "",
    category: req.body.category ?? "figure",
    image: req.body.image ?? "",
    badge: req.body.badge ?? "",
    badgeColor: req.body.badgeColor ?? "",
    rating: Number(req.body.rating) || 0,
    reviews: Number(req.body.reviews) || 0,
    order: items.length,
  };
  items.push(item);
  write(items);
  res.status(201).json(item);
});

router.put("/:id", (req: Request, res: Response) => {
  const items = read();
  const id = Number(req.params.id);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
  items[idx] = { ...items[idx], ...req.body, id };
  write(items);
  res.json(items[idx]);
});

router.delete("/:id", (req: Request, res: Response) => {
  let items = read();
  items = items.filter((i) => i.id !== Number(req.params.id));
  items.forEach((item, i) => { item.order = i; });
  write(items);
  res.json({ success: true });
});

router.patch("/reorder", (req: Request, res: Response) => {
  const { ids }: { ids: number[] } = req.body;
  const items = read();
  const reordered = ids.map((id, i) => {
    const item = items.find((it) => it.id === id);
    if (!item) return null;
    return { ...item, order: i };
  }).filter(Boolean) as Product[];
  write(reordered);
  res.json(reordered);
});

export default router;
