"use client";

import { useRef, useState } from "react";
import { Upload, X, Video } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function VideoUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = value.startsWith("/uploads/") ? `${API}${value}` : value;

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch {
      alert("업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) handleFile(file);
  }

  return (
    <div
      className={`relative aspect-video rounded-xl overflow-hidden border-2 border-dashed transition-colors ${
        uploading
          ? "border-violet-400/50 bg-violet-500/5"
          : "border-white/15 hover:border-white/30 cursor-pointer"
      }`}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {displayUrl ? (
        <>
          <video
            src={displayUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
            onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
            <div className="text-white text-center">
              <Upload size={22} className="mx-auto mb-1" />
              <p className="text-xs font-semibold">클릭하여 변경</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/80 transition-all z-10"
          >
            <X size={12} />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full pointer-events-none">
            <Video size={10} className="text-violet-400" />
            <span className="text-white/70 text-[10px]">마우스 올리면 미리보기</span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30">
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-violet-400/50 border-t-violet-400 rounded-full animate-spin" />
              <p className="text-xs text-violet-400">업로드 중... (파일 크기에 따라 시간이 걸릴 수 있습니다)</p>
            </>
          ) : (
            <>
              <Video size={28} />
              <p className="text-xs font-semibold">클릭하거나 동영상을 드래그하세요</p>
              <p className="text-[10px]">MP4, MOV, WEBM (최대 200MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
