"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Alert = {
  id: string;
  event: string;
  severity: string;
  headline: string;
  areaDesc: string;
  expires: string;
  geometry: any;
};
type Chaser = { id: string; name: string; lat: number; lon: number; reportedAt?: string };

const NEXRAD =
  "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png";

const DARK_BASE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

export default function TornadoMap({
  alerts,
  chasers,
  showRadar,
}: {
  alerts: Alert[];
  chasers: Chaser[];
  showRadar: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const alertLayerRef = useRef<L.LayerGroup | null>(null);
  const chaserLayerRef = useRef<L.LayerGroup | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);

  // Init map once
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      center: [37.5, -95],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(DARK_BASE, {
      maxZoom: 16,
      attribution:
        '© <a href="https://www.esri.com/">Esri</a>',
    }).addTo(map);

    alertLayerRef.current = L.layerGroup().addTo(map);
    chaserLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Toggle NEXRAD overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (showRadar) {
      if (!radarLayerRef.current) {
        radarLayerRef.current = L.tileLayer(NEXRAD, {
          opacity: 0.55,
          maxZoom: 12,
          attribution: 'NEXRAD © Iowa State Mesonet',
        }).addTo(map);
      }
    } else if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
      radarLayerRef.current = null;
    }
  }, [showRadar]);

  // Render alerts
  useEffect(() => {
    const layer = alertLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();

    const styleFor = (event: string) => {
      if (/Tornado Warning/i.test(event))
        return { color: "#dc2626", weight: 2, fillColor: "#dc2626", fillOpacity: 0.25 };
      if (/Tornado Watch/i.test(event))
        return { color: "#f59e0b", weight: 2, fillColor: "#f59e0b", fillOpacity: 0.15 };
      if (/Severe Thunderstorm Warning/i.test(event))
        return { color: "#facc15", weight: 2, fillColor: "#facc15", fillOpacity: 0.18 };
      return { color: "#7dd3fc", weight: 2, fillColor: "#7dd3fc", fillOpacity: 0.12 };
    };

    let bounds: L.LatLngBounds | null = null;
    for (const a of alerts) {
      if (!a.geometry) continue;
      try {
        const geo = L.geoJSON(a.geometry, {
          style: styleFor(a.event) as any,
        }).bindPopup(
          `<div style="min-width:200px"><strong>${escapeHtml(a.event)}</strong><br/>
           <span style="opacity:0.8;font-size:12px">${escapeHtml(a.areaDesc)}</span><br/>
           <p style="font-size:12px;margin-top:6px">${escapeHtml(a.headline || "")}</p>
           <small style="opacity:0.65">Expires ${new Date(a.expires).toLocaleString()}</small></div>`
        );
        geo.addTo(layer);
        const b = geo.getBounds();
        if (b.isValid()) bounds = bounds ? bounds.extend(b) : b;
      } catch {
        // skip malformed geometry
      }
    }
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8, animate: true });
    }
  }, [alerts]);

  // Render chasers
  useEffect(() => {
    const layer = chaserLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const chaserIcon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;border-radius:50%;background:#7dd3fc;border:2px solid #04060c;box-shadow:0 0 0 2px rgba(125,211,252,0.5);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    for (const c of chasers) {
      const m = L.marker([c.lat, c.lon], { icon: chaserIcon });
      m.bindPopup(
        `<div><strong>${escapeHtml(c.name)}</strong><br/><small style="opacity:0.7">Chaser · ${c.reportedAt || ""}</small></div>`
      );
      m.addTo(layer);
    }
  }, [chasers]);

  return <div ref={ref} className="w-full h-full" />;
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]
  );
}
