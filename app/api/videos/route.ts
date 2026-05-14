import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";
export const revalidate = 30;

export type ShaneVideo = {
  id: string;
  url: string;
  title: string;
  caption: string;
  filter: string;
  durationSec?: number;
  postedAt: string;
  thumbnailUrl?: string;
};

export async function GET() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ videos: [] as ShaneVideo[], configured: false });
    }
    const { blobs } = await list({ prefix: "videos/" });
    const videos: ShaneVideo[] = blobs
      .filter((b) => b.pathname.endsWith(".webm") || b.pathname.endsWith(".mp4"))
      .map((b) => {
        // Look for a sibling metadata JSON
        const meta = blobs.find((m) => m.pathname === b.pathname.replace(/\.(webm|mp4)$/, ".json"));
        const thumb = blobs.find((m) => m.pathname === b.pathname.replace(/\.(webm|mp4)$/, ".jpg"));
        const id = b.pathname.replace(/^videos\//, "").replace(/\.(webm|mp4)$/, "");
        return {
          id,
          url: b.url,
          title: "Stormin' Shane update",
          caption: "",
          filter: "natural",
          postedAt: b.uploadedAt.toISOString(),
          metaUrl: meta?.url,
          thumbnailUrl: thumb?.url,
        } as ShaneVideo & { metaUrl?: string };
      })
      .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));

    // Inline metadata (titles, captions, filter) by fetching JSON siblings in parallel.
    const enriched = await Promise.all(
      videos.map(async (v: any) => {
        if (!v.metaUrl) return v;
        try {
          const m = await fetch(v.metaUrl, { cache: "no-store" }).then((r) => r.json());
          return { ...v, ...m };
        } catch {
          return v;
        }
      })
    );

    return NextResponse.json({ videos: enriched, configured: true });
  } catch (err: any) {
    return NextResponse.json({ videos: [], configured: false, error: err?.message }, { status: 200 });
  }
}
