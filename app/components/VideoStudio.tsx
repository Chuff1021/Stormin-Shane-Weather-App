"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  CameraOff,
  Circle,
  Mic,
  MicOff,
  RotateCw,
  Trash2,
  Upload,
  Video as VideoIcon,
} from "lucide-react";
import { FILTERS, FRAG, VERT, type FilterId } from "@/lib/filters";

type PublishedVideo = {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  postedAt: string;
};

const TARGET_WIDTH = 720;
const TARGET_HEIGHT = 1280;

export default function VideoStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programsRef = useRef<Map<FilterId, WebGLProgram>>(new Map());
  const textureRef = useRef<WebGLTexture | null>(null);
  const rafRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [filter, setFilter] = useState<FilterId>("news_anchor");
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [micOn, setMicOn] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [preview, setPreview] = useState<{ url: string; blob: Blob } | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [published, setPublished] = useState<PublishedVideo[]>([]);

  // --- Camera + WebGL setup ---
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      // Stop any prior stream
      streamRef.current?.getTracks().forEach((t) => t.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: TARGET_WIDTH },
          height: { ideal: TARGET_HEIGHT },
          aspectRatio: 9 / 16,
        },
        audio: micOn,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraReady(true);
    } catch (err: any) {
      setCameraError(err?.message || "Couldn't access camera.");
      setCameraReady(false);
    }
  }, [facing, micOn]);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  // Initialize WebGL once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) return;
    glRef.current = gl;

    // Quad vertex buffer
    const quad = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
       1,  1, 1, 0,
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    // Texture for video frames
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    textureRef.current = tex;

    // Compile all filter programs
    for (const f of FILTERS) {
      const prog = makeProgram(gl, VERT, FRAG[f.id]);
      if (prog) programsRef.current.set(f.id, prog);
    }
  }, []);

  // Render loop — draws video → canvas via current filter
  useEffect(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const tex = textureRef.current;
    if (!gl || !canvas || !video || !tex) return;

    function render(now: number) {
      if (
        video!.readyState >= 2 &&
        video!.videoWidth > 0 &&
        video!.videoHeight > 0
      ) {
        if (
          canvas!.width !== video!.videoWidth ||
          canvas!.height !== video!.videoHeight
        ) {
          canvas!.width = video!.videoWidth;
          canvas!.height = video!.videoHeight;
        }
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
        gl!.bindTexture(gl!.TEXTURE_2D, tex!);
        gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, 0);
        gl!.texImage2D(
          gl!.TEXTURE_2D,
          0,
          gl!.RGBA,
          gl!.RGBA,
          gl!.UNSIGNED_BYTE,
          video!
        );

        const prog = programsRef.current.get(filter);
        if (prog) {
          gl!.useProgram(prog);
          const posLoc = gl!.getAttribLocation(prog, "a_pos");
          const uvLoc = gl!.getAttribLocation(prog, "a_uv");
          gl!.enableVertexAttribArray(posLoc);
          gl!.enableVertexAttribArray(uvLoc);
          gl!.vertexAttribPointer(posLoc, 2, gl!.FLOAT, false, 16, 0);
          gl!.vertexAttribPointer(uvLoc, 2, gl!.FLOAT, false, 16, 8);
          const uRes = gl!.getUniformLocation(prog, "u_res");
          const uTime = gl!.getUniformLocation(prog, "u_time");
          gl!.uniform2f(uRes, canvas!.width, canvas!.height);
          gl!.uniform1f(uTime, now / 1000);
          gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        }
      }
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [filter, cameraReady]);

  // Refresh published list
  useEffect(() => {
    refreshPublished();
  }, []);

  async function refreshPublished() {
    try {
      const d = await fetch("/api/videos", { cache: "no-store" }).then((r) =>
        r.json()
      );
      setPublished(d.videos || []);
    } catch {}
  }

  // --- Recording ---
  function startRecording() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasStream = canvas.captureStream(30);
    // Mix in audio track from getUserMedia
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) canvasStream.addTrack(audioTrack);

    chunksRef.current = [];
    const recorder = new MediaRecorder(canvasStream, {
      mimeType: pickMime(),
      videoBitsPerSecond: 4_000_000,
    });
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setPreview({ url, blob });
    };
    recorder.start(250);
    recorderRef.current = recorder;
    setRecording(true);
    setPaused(false);
    setSeconds(0);
  }

  function stopRecording() {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") r.stop();
    setRecording(false);
    setPaused(false);
  }

  function togglePause() {
    const r = recorderRef.current;
    if (!r) return;
    if (r.state === "recording") {
      r.pause();
      setPaused(true);
    } else if (r.state === "paused") {
      r.resume();
      setPaused(false);
    }
  }

  useEffect(() => {
    if (!recording || paused) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording, paused]);

  // --- Upload ---
  async function publish() {
    if (!preview) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const ext = preview.blob.type.includes("mp4") ? "mp4" : "webm";

      // Upload the video
      const videoBlob = await upload(`videos/${id}.${ext}`, preview.blob, {
        access: "public",
        handleUploadUrl: "/api/videos/upload",
        contentType: preview.blob.type,
        onUploadProgress: ({ percentage }) => setUploadProgress(percentage),
      });

      // Upload metadata sidecar JSON
      const meta = {
        id,
        title: title.trim() || "Stormin' Shane update",
        caption: caption.trim(),
        filter,
        postedAt: new Date().toISOString(),
      };
      await upload(`videos/${id}.json`, new Blob([JSON.stringify(meta)], { type: "application/json" }), {
        access: "public",
        handleUploadUrl: "/api/videos/upload",
        contentType: "application/json",
      });

      // Generate and upload a thumbnail (first-frame snapshot of the canvas)
      const thumb = await captureThumbnail(preview.url);
      if (thumb) {
        await upload(`videos/${id}.jpg`, thumb, {
          access: "public",
          handleUploadUrl: "/api/videos/upload",
          contentType: "image/jpeg",
        });
      }

      // Reset and refresh
      URL.revokeObjectURL(preview.url);
      setPreview(null);
      setTitle("");
      setCaption("");
      setUploadProgress(0);
      await refreshPublished();
      alert("Posted to the home screen ✓");
    } catch (err: any) {
      alert(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function deleteVideo(id: string) {
    if (!confirm("Delete this video update?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    await refreshPublished();
  }

  // ----- UI -----
  const blocked = !cameraReady && cameraError;

  return (
    <div className="px-4 pb-32 space-y-5">
      {/* Camera viewport */}
      <div className="relative aspect-[9/16] rounded-3xl overflow-hidden glass-strong border border-white/10">
        {/* Hidden source video */}
        <video ref={videoRef} className="hidden" muted playsInline />
        {/* Canvas is the visible, filtered preview */}
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        {/* Recording indicator */}
        {recording && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full bg-siren-500 ${
                paused ? "" : "animate-pulse"
              }`}
            />
            <span className="font-medium">
              {paused ? "Paused" : "REC"} · {formatTime(seconds)}
            </span>
          </div>
        )}

        {/* Camera flip + mic toggle */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() =>
              setFacing((f) => (f === "user" ? "environment" : "user"))
            }
            className="w-9 h-9 rounded-full bg-black/55 border border-white/15 flex items-center justify-center"
            aria-label="Flip camera"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMicOn((v) => !v)}
            className="w-9 h-9 rounded-full bg-black/55 border border-white/15 flex items-center justify-center"
            aria-label="Toggle mic"
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>

        {blocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/70">
            <CameraOff className="w-8 h-8 mb-3 text-siren-500" />
            <div className="font-semibold">Camera unavailable</div>
            <div className="text-sm text-white/70 mt-1">{cameraError}</div>
            <button
              onClick={startCamera}
              className="mt-4 rounded-xl bg-bolt-500 text-ink-950 font-semibold px-4 py-2 text-sm"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-2xl px-3 py-2 text-xs border ${
                filter === f.id
                  ? "bg-bolt-500/20 border-bolt-500/50 text-bolt-400"
                  : "bg-white/5 border-white/10 text-white/70"
              }`}
            >
              <div className="font-semibold">{f.label}</div>
              <div className="opacity-70 text-[10px]">{f.blurb}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Record controls */}
      <div className="flex items-center justify-center gap-6">
        {recording ? (
          <>
            <button
              onClick={togglePause}
              className="rounded-full w-14 h-14 bg-white/10 border border-white/15 flex items-center justify-center"
              aria-label="Pause"
            >
              {paused ? "▶" : "❚❚"}
            </button>
            <button
              onClick={stopRecording}
              className="rounded-full w-20 h-20 bg-siren-600 border-4 border-white/30 flex items-center justify-center text-white font-semibold"
              aria-label="Stop"
            >
              ■
            </button>
            <div className="w-14" />
          </>
        ) : (
          <button
            onClick={startRecording}
            disabled={!cameraReady}
            className="rounded-full w-20 h-20 bg-siren-500 border-4 border-white/30 flex items-center justify-center disabled:opacity-50"
            aria-label="Record"
          >
            <Circle className="w-7 h-7 fill-white text-white" />
          </button>
        )}
      </div>

      {/* Preview + publish */}
      {preview && (
        <div className="glass-strong rounded-3xl p-4 border border-white/10 space-y-3">
          <div className="text-xs uppercase tracking-wider text-white/50">
            Review & post
          </div>
          <video
            src={preview.url}
            controls
            playsInline
            className="w-full rounded-2xl bg-black aspect-[9/16]"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. Tornado watch update — Republic, MO)"
            className="w-full bg-white/5 rounded-xl px-3 py-2.5 border border-white/10 text-sm placeholder:text-white/40"
          />
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption — what's happening, what folks should do"
            rows={3}
            className="w-full bg-white/5 rounded-xl px-3 py-2.5 border border-white/10 text-sm placeholder:text-white/40 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                URL.revokeObjectURL(preview.url);
                setPreview(null);
              }}
              className="flex-1 rounded-xl py-3 bg-white/5 border border-white/10 text-sm"
            >
              Discard
            </button>
            <button
              onClick={publish}
              disabled={uploading}
              className="flex-1 rounded-xl py-3 bg-bolt-500 text-ink-950 font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? `Publishing ${Math.round(uploadProgress)}%`
                : "Post to home screen"}
            </button>
          </div>
        </div>
      )}

      {/* Recent posts */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-white/40 mt-2">
          Recent posts
        </div>
        {published.length === 0 && (
          <div className="glass rounded-2xl p-4 text-sm text-white/60">
            No posts yet. Record a clip above and tap "Post to home screen".
          </div>
        )}
        {published.map((v) => (
          <div
            key={v.id}
            className="glass rounded-2xl p-3 flex items-center gap-3"
          >
            <video
              src={v.url}
              muted
              playsInline
              className="w-16 h-24 object-cover rounded-lg bg-black"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                {v.title || "Stormin' Shane update"}
              </div>
              <div className="text-xs text-white/60 truncate">{v.caption}</div>
              <div className="text-[10px] text-white/40 mt-0.5">
                {new Date(v.postedAt).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => deleteVideo(v.id)}
              aria-label="Delete"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- helpers ----------

function pickMime() {
  const opts = [
    "video/mp4;codecs=h264,aac",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const m of opts) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return "video/webm";
}

function formatTime(s: number) {
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function makeProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("link error", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("shader error", gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

async function captureThumbnail(videoUrl: string): Promise<Blob | null> {
  try {
    const v = document.createElement("video");
    v.src = videoUrl;
    v.muted = true;
    v.playsInline = true;
    await new Promise<void>((resolve, reject) => {
      v.onloadeddata = () => resolve();
      v.onerror = () => reject(new Error("video load failed"));
    });
    v.currentTime = Math.min(0.4, v.duration / 4);
    await new Promise<void>((res) => (v.onseeked = () => res()));
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    return await new Promise<Blob | null>((res) =>
      c.toBlob((b) => res(b), "image/jpeg", 0.85)
    );
  } catch {
    return null;
  }
}
