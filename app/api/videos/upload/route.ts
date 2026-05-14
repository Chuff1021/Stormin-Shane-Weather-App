import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { isShane } from "@/lib/auth";

// Vercel Blob client upload handshake.
// The browser hits this endpoint twice:
//   1) to get a one-time upload token (we verify auth here)
//   2) (server-to-server) when Vercel Blob has stored the file (onUploadCompleted)
//
// We restrict uploads to authenticated Shane sessions.

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isShane())) {
          throw new Error("Not authorized — sign in to Shane's studio first.");
        }
        if (!pathname.startsWith("videos/")) {
          throw new Error("Invalid path");
        }
        return {
          allowedContentTypes: [
            "video/webm",
            "video/mp4",
            "video/quicktime",
            "image/jpeg",
            "application/json",
          ],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Best-effort logging; the file is already stored.
        console.log("[upload] stored", blob.pathname, blob.url);
      },
    });

    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "upload failed" }, { status: 400 });
  }
}
