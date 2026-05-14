"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { NWSAlert } from "@/lib/nws";

export default function AlertBanner({ alerts }: { alerts: NWSAlert[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!alerts.length) return null;
  const primary = alerts[0];

  return (
    <div className="rounded-2xl bg-siren-pulse text-white shadow-lg siren">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
      >
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-widest opacity-90">
            {primary.severity} · NWS
          </div>
          <div className="font-semibold truncate">{primary.event}</div>
          <div className="text-xs opacity-90 truncate">{primary.areaDesc}</div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="rounded-xl bg-black/25 p-3 border border-white/15"
            >
              <div className="font-semibold">{a.event}</div>
              <div className="text-xs opacity-85 mb-2">{a.areaDesc}</div>
              <p className="whitespace-pre-line text-[13px] opacity-95">
                {a.headline}
              </p>
              {a.instruction && (
                <p className="mt-2 text-[13px] opacity-90">
                  <strong>What to do:</strong> {a.instruction}
                </p>
              )}
              <p className="mt-2 text-[11px] opacity-70">
                Expires {new Date(a.expires).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
