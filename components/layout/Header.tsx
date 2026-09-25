"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  preferredStudyTime?: string;
  role?: "student" | "admin";

  preferences?: {
    dailyGoal?: number;
    preferredDifficulty?: "Beginner" | "Intermediate" | "Advanced";
  };

  notifications?: {
    emailUpdates?: boolean;
    studyReminders?: boolean;
    weeklySummary?: boolean;
  };
}

interface ProfileResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const router = useRouter();

  const profileRef = useRef<HTMLDivElement>(null);

  /*
   * Fetch logged-in user's profile
   */
  useEffect(() => {
    async function fetchProfile() {
      try {
        setProfileLoading(true);

        const response = await fetch(
          `${API_URL}/users/profile`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: ProfileResponse =
          await response.json().catch(() => ({
            success: false,
          }));

        if (!response.ok || !result.success) {
          console.error(
            "Failed to load profile:",
            result.message
          );

          return;
        }

        if (result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error(
          "Profile request failed:",
          error
        );
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, []);

  /*
   * Close profile dropdown when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * Close dropdown on Escape
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /*
   * Logout
   */
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setProfileOpen(false);

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  /*
   * Navigate to profile
   */
  function handleProfile() {
    setProfileOpen(false);
    router.push("/dashboard/profile");
  }

  /*
   * Get user's initials
   */
  function getInitials(name?: string) {
    if (!name) return "U";

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  /*
   * Format role
   */
  function formatRole(role?: string) {
    if (!role) return "Student";

    return (
      role.charAt(0).toUpperCase() +
      role.slice(1)
    );
  }

  const displayName =
    user?.name || "Loading...";

  const displayRole =
    formatRole(user?.role);

  const initials = getInitials(user?.name);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">

        {/* Mobile menu + logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (previous) => !previous
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          <Link
            href="/dashboard"
            className="font-bold text-slate-900"
          >
            StudyTrack
          </Link>
        </div>

        {/* Desktop side spacing */}
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-slate-500">
            Learning workspace
          </p>
        </div>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2">

          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50"
          >
            🔔

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (previous) => !previous
                )
              }
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {profileLoading
                  ? "..."
                  : initials}
              </div>

              {/* User information */}
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {displayName}
                </p>

                <p className="text-[10px] text-slate-400">
                  {displayRole}
                </p>
              </div>

              {/* Arrow */}
              <span
                className={`hidden text-xs text-slate-400 transition-transform sm:block ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5"
                role="menu"
              >
                {/* User header */}
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user?.email || ""}
                      </p>
                    </div>

                  </div>

                  <div className="mt-3">
                    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                      {displayRole}
                    </span>
                  </div>
                </div>

                {/* Profile */}
                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  role="menuitem"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    👤
                  </span>

                  <div>
                    <p className="font-semibold">
                      Profile
                    </p>

                    <p className="text-xs text-slate-400">
                      View your profile
                    </p>
                  </div>
                </button>

                {/* Divider */}
                <div className="mx-4 border-t border-slate-100" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  role="menuitem"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                    ↪
                  </span>

                  <div>
                    <p className="font-semibold">
                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </p>

                    <p className="text-xs text-red-400">
                      Sign out of StudyTrack
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-2">

            <Link
              href="/dashboard"
              onClick={() =>
                setMenuOpen(false)
              }
              className="rounded-xl bg-indigo-50 p-3 text-sm font-medium text-indigo-700"
            >
              ⌂ Dashboard
            </Link>

            <Link
              href="/dashboard/topics"
              onClick={() =>
                setMenuOpen(false)
              }
              className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"
            >
              📚 Topics
            </Link>

            <Link
              href="/dashboard/progress"
              onClick={() =>
                setMenuOpen(false)
              }
              className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"
            >
              📊 Progress
            </Link>

            <Link
              href="/dashboard/ai-tutor"
              onClick={() =>
                setMenuOpen(false)
              }
              className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"
            >
              ✦ AI Tutor
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={() =>
                setMenuOpen(false)
              }
              className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"
            >
              ⚙ Settings
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}