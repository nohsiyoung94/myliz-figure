import express, { Request, Response, NextFunction } from "express";
import { initDB } from "./db";
import authRouter from "./routes/auth";
import reelsRouter from "./routes/reels";
import bannersRouter from "./routes/banners";
import galleryRouter from "./routes/gallery";
import productsRouter from "./routes/products";
import uploadRouter from "./routes/upload";
import contactRouter from "./routes/contact";
import reviewsRouter from "./routes/reviews";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.sendStatus(200); return; }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/reels", reelsRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/products", productsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reviews", reviewsRouter);

initDB()
  .then(() => {
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
