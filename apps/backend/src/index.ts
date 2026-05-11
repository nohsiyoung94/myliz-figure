import express, { Request, Response, NextFunction } from "express";
import path from "path";
import authRouter from "./routes/auth";
import reelsRouter from "./routes/reels";
import bannersRouter from "./routes/banners";
import galleryRouter from "./routes/gallery";
import productsRouter from "./routes/products";
import uploadRouter from "./routes/upload";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.sendStatus(200); return; }
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/reels", reelsRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
