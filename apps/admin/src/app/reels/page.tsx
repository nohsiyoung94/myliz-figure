"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Save, ExternalLink, AlertTriangle, Video, Play } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import VideoUpload from "@/components/VideoUpload";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

function normalize(url: string) {
  if (!url) return "";
  return url.startsWith("/uploads/") ? `${API}${url}` : url;
}

interface Reel {
  id: number;
  title: string;
  caption: string;
  thumbnail: string;
  video: string;
  href: string;
  order: number;
}

const empty: Omit<Reel, "id" | "order"> = {
  title: "",
  caption: "",
  thumbnail: "",
  video: "",
  href: "",
};


function ReelCard({ reel, onEdit, onDelete }: { reel: Reel; onEdit: () => void; onDelete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbSrc = normalize(reel.thumbnail);
  const videoSrc = normalize(reel.video);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-200">
      <div
        className="relative aspect-video overflow-hidden bg-[#111] cursor-pointer"
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
      >
        {videoSrc ? (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              poster={thumbSrc || undefined}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute top-1.5 left-1.5 bg-violet-500/80 px-1.5 py-0.5 rounded text-white text-[9px] font-bold flex items-center gap-1 pointer-events-none">
              <Video size={8} /> VIDEO
            </div>
          </>
        ) : thumbSrc ? (
          <img src={thumbSrc} alt={reel.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
            <Play size={24} className="opacity-30" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
          <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">{reel.caption || "캡션 없음"}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-white font-semibold text-sm mb-1 truncate">{reel.title || "제목 없음"}</p>
        <p className="text-white/30 text-xs mb-3 truncate">{reel.href || "링크 없음"}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors"
          >
            <Pencil size={12} /> 수정
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={12} /> 삭제
          </button>
        </div>
      </div>

      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full">
        <GripVertical size={10} className="text-white/30" />
        <span className="text-white/40 text-[10px]">{reel.order + 1}</span>
      </div>
    </div>
  );
}

function Modal({
  reel,
  onClose,
  onSave,
}: {
  reel: Partial<Reel> | null;
  onClose: () => void;
  onSave: (data: Omit<Reel, "id" | "order">) => void;
}) {
  const [form, setForm] = useState({ ...empty, ...(reel ?? {}) });
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const handleSave = () => {
    if (!form.title.trim()) { alert("제목을 입력해주세요."); return; }
    onSave(form);
  };

  const thumbDisplay = normalize(form.thumbnail);
  const videoDisplay = normalize(form.video);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <h2 className="text-white font-bold text-lg">
            {reel?.id ? "영상 수정" : "새 영상 추가"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: form */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">제목 *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="예) 웨딩 커플 피규어"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">캡션</label>
              <textarea
                rows={2}
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="예) 평생 보며 추억할 수 있습니다"
                className="resize-none"
              />
            </div>

            {/* Video upload */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">
                동영상 파일 <span className="text-violet-400 normal-case">(있으면 홈페이지에서 재생됩니다)</span>
              </label>
              <VideoUpload value={form.video} onChange={(url) => setForm({ ...form, video: url })} />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">
                썸네일 이미지 <span className="text-white/20 normal-case">(동영상 없을 때 표시)</span>
              </label>
              <ImageUpload value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} aspect="aspect-[4/3]" />
            </div>

            {/* Instagram link */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">인스타그램 링크</label>
              <div className="flex gap-2">
                <input
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="https://instagram.com/reel/..."
                />
                {form.href && (
                  <a href={form.href} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: preview */}
          <div>
            <p className="text-xs font-semibold text-white/40 mb-3 tracking-widest uppercase">미리보기</p>
            <div className="rounded-xl overflow-hidden border border-white/8">
              <div
                className="relative aspect-video overflow-hidden bg-[#111] cursor-pointer"
                onMouseEnter={() => previewVideoRef.current?.play()}
                onMouseLeave={() => { if (previewVideoRef.current) { previewVideoRef.current.pause(); previewVideoRef.current.currentTime = 0; } }}
              >
                {videoDisplay ? (
                  <>
                    <video
                      ref={previewVideoRef}
                      src={videoDisplay}
                      poster={thumbDisplay || undefined}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-violet-500/80 px-1.5 py-0.5 rounded text-white text-[9px] font-bold flex items-center gap-1 pointer-events-none">
                      <Video size={8} /> VIDEO
                    </div>
                  </>
                ) : thumbDisplay ? (
                  <img src={thumbDisplay} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">미디어 없음</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
                  <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">
                    {form.caption || "캡션이 여기 표시됩니다"}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-[#0d0d1a]">
                <p className="text-white text-xs font-bold">{form.title || "제목"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 transition-opacity"
          >
            <Save size={14} /> 저장
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ reel, onConfirm, onCancel }: { reel: Reel; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">영상 삭제</h3>
        <p className="text-white/50 text-sm mb-6">
          <span className="text-white font-medium">&ldquo;{reel.title}&rdquo;</span>을 삭제하시겠습니까?<br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors">취소</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-colors">삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [deleting, setDeleting] = useState<Reel | null>(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/reels`);
      if (!res.ok) throw new Error("API 오류");
      setReels(await res.json());
      setError("");
    } catch {
      setError("백엔드 서버에 연결할 수 없습니다. (localhost:4001)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReels(); }, []);

  const handleSave = async (data: Omit<Reel, "id" | "order">) => {
    if (editing?.id) {
      await fetch(`${API}/api/reels/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`${API}/api/reels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setModal(null);
    setEditing(null);
    fetchReels();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await fetch(`${API}/api/reels/${deleting.id}`, { method: "DELETE" });
    setDeleting(null);
    fetchReels();
  };

  const handleReorder = async (id: number, dir: "up" | "down") => {
    const sorted = [...reels].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((r) => r.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === sorted.length - 1) return;
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    const ids = sorted.map((r) => r.id);
    await fetch(`${API}/api/reels/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    fetchReels();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">영상 관리</h1>
          <p className="text-white/30 text-sm mt-1">동영상 파일을 업로드하거나 인스타그램 썸네일을 관리합니다</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModal("add"); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> 영상 추가
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
          <button onClick={fetchReels} className="ml-auto text-red-400 text-xs underline hover:text-red-300">재시도</button>
        </div>
      )}

      {!loading && !error && (
        <p className="text-white/30 text-sm mb-6">
          총 <span className="text-white font-semibold">{reels.length}</span>개의 영상
        </p>
      )}

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl border border-white/8 animate-pulse">
              <div className="aspect-[4/3] bg-white/3" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reels.map((reel) => (
            <div key={reel.id} className="relative">
              <ReelCard
                reel={reel}
                onEdit={() => { setEditing(reel); setModal("edit"); }}
                onDelete={() => setDeleting(reel)}
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button
                  onClick={() => handleReorder(reel.id, "up")}
                  className="w-6 h-6 rounded-md bg-black/60 border border-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors text-xs"
                >▲</button>
                <button
                  onClick={() => handleReorder(reel.id, "down")}
                  className="w-6 h-6 rounded-md bg-black/60 border border-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors text-xs"
                >▼</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && reels.length === 0 && (
        <div className="text-center py-24 glass-card rounded-2xl border border-white/8">
          <p className="text-white/20 text-lg mb-4">아직 영상이 없습니다</p>
          <button
            onClick={() => { setEditing(null); setModal("add"); }}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm"
          >
            <Plus size={16} /> 첫 영상 추가하기
          </button>
        </div>
      )}

      {(modal === "add" || modal === "edit") && (
        <Modal
          reel={editing}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={handleSave}
        />
      )}
      {deleting && (
        <DeleteConfirm reel={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
