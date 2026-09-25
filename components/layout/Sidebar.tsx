"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    label: "My Topics",
    href: "/dashboard/topics",
    icon: "📚",
  },
  {
    label: "AI Tutor",
    href: "/dashboard/ai-tutor",
    icon: "✦",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "⚙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">

      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="border-b border-slate-100 px-6 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-sm">
              🎓
            </div>

            <div>
              <p className="font-bold text-slate-900">
                StudyTrack
              </p>

              <p className="text-[11px] text-slate-400">
                Learn. Track. Improve.
              </p>
            </div>
          </Link>
        </div>


        {/* Menu */}
        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {

              const isDashboard =
                item.href === "/dashboard";

              const isActive =
                isDashboard
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >

                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                      isActive
                        ? "bg-white"
                        : "bg-slate-50"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                </Link>
              );
            })}

          </div>

        </nav>


        {/* Logout */}
        <div className="border-t border-slate-100 p-4">

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
              ↪
            </span>

            Logout
          </button>

        </div>

      </div>

    </aside>
  );
}