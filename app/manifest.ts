import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stormin' Shane Weather",
    short_name: "Stormin' Shane",
    description: "Premier weather, tornado tracker, and Shane's live storm updates.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#04060c",
    theme_color: "#04060c",
    categories: ["weather", "news", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Tornado Tracker", url: "/tracker", description: "Live storm map" },
      { name: "Shane's Studio", url: "/dashboard", description: "Post a video update" },
    ],
  };
}
