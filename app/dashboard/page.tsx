import { redirect } from "next/navigation";
import Link from "next/link";
import { isShane, logout } from "@/lib/auth";
import VideoStudio from "../components/VideoStudio";
import { LogOut, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isShane())) {
    redirect("/dashboard/login");
  }

  async function doLogout() {
    "use server";
    await logout();
    redirect("/dashboard/login");
  }

  return (
    <main className="storm-canvas min-h-screen">
      <header className="safe-top px-4 pb-3 flex items-center gap-3">
        <Link href="/" className="glass rounded-2xl p-3" aria-label="Back home">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-white/50">
            Shane's Studio
          </div>
          <div className="text-lg font-semibold">Post a video update</div>
        </div>
        <form action={doLogout}>
          <button className="glass rounded-2xl p-3" aria-label="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </header>

      <VideoStudio />
    </main>
  );
}
