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
        <div className="glass rounded-2xl h-44 shimmer" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="mx-4 glass rounded-2xl p-5 text-sm text-white/70">
        <div className="font-semibold text-white mb-1 flex items-center gap-2">
          <Video className="w-4 h-4 text-bolt-400" />
          Shane's video studio
        </div>
        Connect Vercel Blob storage to enable video uploads (Vercel project →
        Storage → Create Blob Store). Until then, videos won't post.
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="mx-4 glass rounded-2xl p-5 text-sm text-white/70">
        <div className="font-semibold text-white mb-1">No updates yet</div>
        Shane hasn't posted a clip. The newest video from{" "}
        <code className="text-bolt-400">/dashboard</code> shows up here.
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
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
    <div className="shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden glass-strong border border-white/10">
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
            <div className="w-14 h-14 rounded-full bg-white/85 text-ink-900 flex items-center justify-center shadow-2xl">
              <span className="ml-1 border-y-[10px] border-y-transparent border-l-[16px] border-l-ink-900" />
            </div>
          </button>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold truncate">
          {video.title || "Stormin' Shane update"}
        </div>
        {video.caption && (
          <div className="text-xs text-white/70 line-clamp-2 mt-0.5">
            {video.caption}
          </div>
        )}
        <div className="text-[10px] text-white/40 mt-1">
          {new Date(video.postedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
