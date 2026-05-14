"use client";

import Link from "next/link";
import { ArrowUpRight, Radar } from "lucide-react";

// A small static radar preview that links to the full /tracker page.
// Uses RainViewer to grab the latest precipitation tile centered on the user.

export default function RadarPeek({
  lat,
  lon,
  label,
}: {
  lat: number;
  lon: number;
  label: string;
}) {
  // RainViewer single-frame radar overlay PNG via their public coverage tile.
  // Tile zoom 6, centered approximately on lat/lon.
  const z = 6;
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, z));
  const y = Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
        Math.PI) /
      2) *
      Math.pow(2, z)
  );
  // Use Iowa State Mesonet NEXRAD as the radar source (more reliable, no auth).
  const radarTile = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/${z}/${x}/${y}.png`;
  const baseTile = `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${z}/${y}/${x}`;

  return (
    <div className="mx-4 text-white">
      <div className="label px-1 mb-2">Radar</div>
      <Link
        href="/tracker"
        className="block card overflow-hidden relative active:scale-[0.995] transition"
        aria-label="Open tornado tracker"
      >
        <div className="relative h-44">
          <img
            src={baseTile}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <img
            src={radarTile}
            alt="Live radar"
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                <Radar className="w-3.5 h-3.5" />
                Live NEXRAD
              </div>
              <div className="text-sm font-medium drop-shadow">{label}</div>
            </div>
            <ArrowUpRight className="w-5 h-5 opacity-90" />
          </div>
        </div>
      </Link>
    </div>
  );
}
