"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed, Star, Trash2, X, Search } from "lucide-react";
import type { Place, Unit } from "@/lib/weather";

export default function LocationPicker({
  state,
  onClose,
  onSelect,
  onUseMyLocation,
  onRemove,
  onSaveCurrent,
}: {
  state: { place: Place; saved: Place[]; unit: Unit };
  onClose: () => void;
  onSelect: (p: Place) => void;
  onUseMyLocation: () => void;
  onRemove: (p: Place) => void;
  onSaveCurrent: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  async function doSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`).then(
        (r) => r.json()
      );
      setResults(data.results ?? []);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/55 backdrop-blur"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md card-bright rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:m-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-semibold flex-1">Choose location</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-black/5 rounded-2xl px-3 py-2.5 border border-black/5">
          <Search className="w-4 h-4 opacity-60" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => doSearch(e.target.value)}
            placeholder="City, ZIP, or place"
            className="bg-transparent flex-1 outline-none text-sm placeholder:text-black/40 text-[#0F1B2D]"
          />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={onUseMyLocation}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 bg-sky-500 text-white text-sm font-medium"
          >
            <LocateFixed className="w-4 h-4" /> Use my location
          </button>
          <button
            onClick={onSaveCurrent}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-2.5 bg-amber-400/90 text-[#3a2a00] text-sm font-medium"
          >
            <Star className="w-4 h-4" /> Save current
          </button>
        </div>

        {searching && (
          <div className="mt-4 text-xs opacity-60">Searching…</div>
        )}
        {results.length > 0 && (
          <div className="mt-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider opacity-50 px-1">
              Matches
            </div>
            {results.map((r) => (
              <button
                key={`${r.label}-${r.latitude}`}
                onClick={() => onSelect(r)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/5 transition text-sm"
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {state.saved.length > 0 && (
          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider opacity-50 px-1 mb-1">
              Saved
            </div>
            <div className="space-y-1">
              {state.saved.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-black/5"
                >
                  <button
                    onClick={() => onSelect(p)}
                    className="flex-1 text-left text-sm py-1.5"
                  >
                    {p.label}
                  </button>
                  <button
                    onClick={() => onRemove(p)}
                    aria-label={`Remove ${p.label}`}
                    className="p-1.5 rounded-lg hover:bg-black/10 opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
