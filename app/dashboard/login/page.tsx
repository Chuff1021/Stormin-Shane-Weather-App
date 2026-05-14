"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Video } from "lucide-react";
import Sky from "../../components/Sky";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Login failed.");
      }
      router.replace("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-white">
      <Sky mood="clear-night" />
      <form
        onSubmit={submit}
        className="card p-6 w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/85 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="label">Stormin' Shane</div>
            <div className="font-semibold">Shane's Studio</div>
          </div>
        </div>

        <label className="label block mb-2">Username</label>
        <div className="flex items-center gap-2 bg-white/15 rounded-2xl px-3 py-2.5 border border-white/20">
          <User className="w-4 h-4 opacity-80" />
          <input
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="shane"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/55"
          />
        </div>

        <label className="label block mb-2 mt-4">Password</label>
        <div className="flex items-center gap-2 bg-white/15 rounded-2xl px-3 py-2.5 border border-white/20">
          <Lock className="w-4 h-4 opacity-80" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/55"
          />
        </div>

        {err && <div className="mt-3 text-sm text-rose-300">{err}</div>}

        <button
          disabled={loading}
          className="w-full mt-5 rounded-2xl py-3 bg-white text-[#0F1B2D] font-semibold disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Enter studio"}
        </button>

        <p className="mt-4 text-[11px] opacity-70 text-center leading-relaxed">
          Default: <code>shane</code> / <code>stormin2026</code>.<br />
          Override on Vercel via <code>SHANE_USERNAME</code> + <code>SHANE_PASSWORD</code>.
        </p>
      </form>
    </main>
  );
}
