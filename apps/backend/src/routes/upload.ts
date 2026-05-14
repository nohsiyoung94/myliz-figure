// /api/upload
import { Router, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("이미지 또는 동영상 파일만 업로드 가능합니다."));
  },
});

// POST /api/upload — 이미지/영상 Cloudinary 업로드 (form-data: file)
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "파일이 없습니다." }); return; }

  const isVideo = req.file.mimetype.startsWith("video/");
  const buffer = req.file.buffer;

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "myliz", resource_type: isVideo ? "video" : "image" },
        (err, result) => {
          if (err || !result) reject(err ?? new Error("업로드 실패"));
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: "업로드에 실패했습니다." });
  }
});

export default router;
