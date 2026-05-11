import { Router, Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "myreez2024";
  if (password === adminPassword) {
    res.json({ ok: true, token: adminPassword });
  } else {
    res.status(401).json({ ok: false, error: "비밀번호가 틀렸습니다." });
  }
});

router.get("/verify", (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "myreez2024";
  const auth = req.headers.authorization;
  if (auth === `Bearer ${adminPassword}`) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
});

export default router;
