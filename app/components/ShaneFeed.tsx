"use client";

import { useEffect, useState } from "react";
import { Video } from "lucide-react";

type ShaneVideo = {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  filter?: string;
  postedAt: string;
  thumbnailUrl?: string;
};

export default function ShaneFeed() {
  const [videos, setVideos] = useState<ShaneVideo[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/videos", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setVideos(d.videos || []);
        setConfigured(d.configured !== false);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="px-4">
        <div className="card h-40 shimmer-bg" />
      </div>
    );
  }

  // Suppress the section if there's nothing to show — keeps the home page clean.
  if (!configured || !videos.length) return null;

  return (
    <div className="text-white">
      <div className="px-5 mb-2 label flex items-center gap-2">
        <Video className="w-3.5 h-3.5" />
        From Shane
      </div>
      <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: ShaneVideo }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="shrink-0 w-60 rounded-2xl overflow-hidden card">
      <div className="relative aspect-[9/16] bg-black">
        <video
          src={video.url}
          poster={video.thumbnailUrl}
          controls={playing}
          playsInline
          onPlay={() => setPlaying(true)}
          className="w-full h-full object-cover"
        />
        {!playing && (
          <button
            onClick={(e) => {
              const v = e.currentTarget
                .closest(".relative")
                ?.querySelector("video") as HTMLVideoElement | null;
              v?.play().catch(() => {});
            }}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            <div className="w-14 h-14 rounded-full bg-white/90 text-[#0F1B2D] flex items-center justify-center shadow-2xl">
              <span className="ml-1 border-y-[10px] border-y-transparent border-l-[16px] border-l-[#0F1B2D]" />
            </div>
          </button>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold truncate">
          {video.title || "Stormin' Shane update"}
        </div>
        {video.caption && (
          <div className="text-xs opacity-80 line-clamp-2 mt-0.5">
            {video.caption}
          </div>
        )}
        <div className="text-[10px] opacity-65 mt-1">
          {new Date(video.postedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
