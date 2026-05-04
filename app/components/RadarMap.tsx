'use client';

import { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = { lat: number; lon: number; label: string };
type RainFrame = { time: number; path: string };

export default function RadarMap({ lat, lon, label }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const radarLayerRef = useRef<Leaflet.TileLayer | null>(null);
  const [frames, setFrames] = useState<RainFrame[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [host, setHost] = useState('https://tilecache.rainviewer.com');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const L = await import('leaflet');
      if (!el.current || cancelled) return;
      if (!mapRef.current) {
        mapRef.current = L.map(el.current, { zoomControl: false, attributionControl: false }).setView([lat, lon], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapRef.current);
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
        L.control.attribution({ position: 'bottomleft', prefix: false }).addAttribution('© OSM · RainViewer').addTo(mapRef.current);
      } else {
        mapRef.current.setView([lat, lon], mapRef.current.getZoom() || 7, { animate: true });
      }
      const rv = await fetch('https://api.rainviewer.com/public/weather-maps.json').then(r => r.json());
      const all: RainFrame[] = [...(rv.radar?.past || []), ...(rv.radar?.nowcast || [])];
      if (!cancelled) {
        setHost(rv.host || 'https://tilecache.rainviewer.com');
        setFrames(all);
        setFrameIndex(Math.max(0, (rv.radar?.past || []).length - 1));
      }
    }
    boot();
    return () => { cancelled = true; };
  }, [lat, lon]);

  useEffect(() => {
    let t: ReturnType<typeof setInterval> | undefined;
    if (playing && frames.length) t = setInterval(() => setFrameIndex(i => (i + 1) % frames.length), 850);
    return () => { if (t) clearInterval(t); };
  }, [playing, frames.length]);

  useEffect(() => {
    async function updateLayer() {
      if (!mapRef.current || !frames[frameIndex]) return;
      const L = await import('leaflet');
      if (radarLayerRef.current) mapRef.current.removeLayer(radarLayerRef.current);
      const frame = frames[frameIndex];
      radarLayerRef.current = L.tileLayer(`${host}${frame.path}/256/{z}/{x}/{y}/6/1_1.png`, { opacity: 0.72, zIndex: 20 });
      radarLayerRef.current.addTo(mapRef.current);
    }
    updateLayer();
  }, [frames, frameIndex, host]);

  const frame = frames[frameIndex];
  return <div className="radarWrap">
    <div ref={el} className="leafletMap" aria-label={`Rain radar for ${label}`} />
    <div className="radarControls">
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
      <input aria-label="Radar timeline" type="range" min={0} max={Math.max(0, frames.length - 1)} value={frameIndex} onChange={e => setFrameIndex(Number(e.target.value))} />
      <span>{frame ? new Date(frame.time * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Loading'}</span>
    </div>
  </div>;
}
