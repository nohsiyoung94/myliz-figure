"use client";

import { useRef, useState } from "react";
import { Upload, X, Link } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

interface Props {
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
}

export default function ImageUpload({ value, onChange, aspect = "aspect-video" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value.startsWith("http") && !value.includes("/uploads/") ? value : "");
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
    if (file?.type.startsWith("image/")) handleFile(file);
  }

  function handleUrlConfirm() {
    if (urlInput.trim()) onChange(urlInput.trim());
    setUrlMode(false);
  }

  return (
    <div className="space-y-2">
      {/* Upload area */}
      <div
        className={`relative ${aspect} rounded-xl overflow-hidden border-2 border-dashed transition-colors ${
          uploading ? "border-cyan-400/50 bg-cyan-500/5" : "border-white/15 hover:border-white/30 cursor-pointer"
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {displayUrl ? (
          <>
            <img src={displayUrl} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-white text-center">
                <Upload size={22} className="mx-auto mb-1" />
                <p className="text-xs font-semibold">클릭하여 변경</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); setUrlInput(""); }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/80 transition-all z-10"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30">
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-xs text-cyan-400">업로드 중...</p>
              </>
            ) : (
              <>
                <Upload size={24} />
                <p className="text-xs font-semibold">클릭하거나 이미지를 드래그하세요</p>
                <p className="text-[10px]">JPG, PNG, WEBP (최대 10MB)</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input toggle */}
      {!urlMode ? (
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors"
        >
          <Link size={11} />
          URL로 직접 입력
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlConfirm()}
            placeholder="https://..."
            className="flex-1 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={handleUrlConfirm}
            className="px-3 py-2 rounded-xl bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors"
          >
            확인
          </button>
          <button
            type="button"
            onClick={() => setUrlMode(false)}
            className="px-3 py-2 rounded-xl text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            취소
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
