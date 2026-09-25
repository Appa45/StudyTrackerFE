"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import StatCard from "../../components/dashboard/StatCard";
import TopicCard from "../../components/dashboard/TopicCard";
import ProgressOverview from "../../components/dashboard/ProgressOverview";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type TopicStatus =
  | "Completed"
  | "In Progress"
  | "Pending"
  | "Not Started";

interface User {
  id: string;
  name: string;
  email: string;
}

interface DashboardTopic {
  id?: string;
  _id?: string;
  title: string;
  subject: string;
  progress: number;
  status: TopicStatus;
}

interface DashboardStats {
  totalTopics: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  averageProgress: number;
}

interface DashboardResponse {
  success: boolean;
  data?: {
    stats?: DashboardStats;
    todayTopics?: DashboardTopic[];
    recentTopics?: DashboardTopic[];
  };
  message?: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    totalTopics: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    averageProgress: 0,
  });

  const [todayTopics, setTodayTopics] = useState<DashboardTopic[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * -------------------------------------------------------
   * GET CURRENT USER
   * -------------------------------------------------------
   */
  async function getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to fetch current user."
      );
    }

    return data.user as User;
  }

  /*
   * -------------------------------------------------------
   * GET DASHBOARD DATA
   * -------------------------------------------------------
   */
  async function getDashboardData() {
    const response = await fetch(
      `${API_URL}/dashboard/overview`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }
    );

    const data: DashboardResponse = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load dashboard."
      );
    }

    return data;
  }

  /*
   * -------------------------------------------------------
   * LOAD DASHBOARD
   * -------------------------------------------------------
   */
  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        /*
         * Fetch user and dashboard data together.
         * This reduces total waiting time.
         */
        const [currentUser, dashboardResponse] =
          await Promise.all([
            getCurrentUser(),
            getDashboardData(),
          ]);

        if (!isMounted) return;

        setUser(currentUser);

        if (dashboardResponse.data?.stats) {
          setStats({
            totalTopics:
              dashboardResponse.data.stats.totalTopics ?? 0,

            completed:
              dashboardResponse.data.stats.completed ?? 0,

            inProgress:
              dashboardResponse.data.stats.inProgress ?? 0,

            notStarted:
              dashboardResponse.data.stats.notStarted ?? 0,

            averageProgress:
              dashboardResponse.data.stats.averageProgress ?? 0,
          });
        }

        setTodayTopics(
          dashboardResponse.data?.todayTopics ?? []
        );
      } catch (error) {
        console.error("Dashboard loading error:", error);

        if (!isMounted) return;

        /*
         * If the authentication cookie is missing/expired,
         * send the user back to login.
         */
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load dashboard.";

        if (
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("authentication")
        ) {
          router.replace("/login");
          return;
        }

        setError(errorMessage);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /*
   * -------------------------------------------------------
   * NORMALIZE TOPIC IDS
   * -------------------------------------------------------
   */
  const normalizedTopics = useMemo(() => {
    return todayTopics.map((topic) => ({
      ...topic,
      id: topic.id ?? topic._id ?? "",
    }));
  }, [todayTopics]);

  /*
   * -------------------------------------------------------
   * CURRENT DATE
   * -------------------------------------------------------
   */
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  /*
   * -------------------------------------------------------
   * LOADING STATE
   * -------------------------------------------------------
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * ERROR STATE
   * -------------------------------------------------------
   */
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
            !
          </div>

          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const userName = user?.name || "Ayyappa";

  return (
    <div className="space-y-6">
      {/* =========================================
          HEADER / GREETING
      ========================================== */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Welcome back
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Good morning, {userName} 👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Keep going, every little step counts.
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-semibold text-slate-700">
            {currentDate}
          </p>

          <p className="mt-1 text-xs italic text-slate-400">
            "Discipline today, success tomorrow."
          </p>
        </div>
      </section>

      {/* =========================================
          STAT CARDS
      ========================================== */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Topics"
          value={String(stats.totalTopics)}
          description="All your topics"
          icon="📚"
          iconClassName="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Completed"
          value={String(stats.completed)}
          description="Topics completed"
          icon="✓"
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="In Progress"
          value={String(stats.inProgress)}
          description="Currently learning"
          icon="◷"
          iconClassName="bg-orange-50 text-orange-500"
        />

        <StatCard
          title="Pending"
          value={String(stats.notStarted)}
          description="Not started yet"
          icon="□"
          iconClassName="bg-pink-50 text-pink-500"
        />
      </section>

      {/* =========================================
          TODAY'S TOPICS + OVERALL PROGRESS
      ========================================== */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
        {/* Today's Topics */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Today's Topics
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Continue your learning journey
              </p>
            </div>

            <Link
              href="/dashboard/topics"
              className="shrink-0 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              View All →
            </Link>
          </div>

          <div className="mt-5 space-y-2">
            {normalizedTopics.length > 0 ? (
              normalizedTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  {...topic}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No topics for today
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add a topic and start learning.
                </p>

                <Link
                  href="/dashboard/topics"
                  className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  View Topics
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Overall Progress */}
        <ProgressOverview
           progress={stats.averageProgress}
  completed={stats.completed}
  inProgress={stats.inProgress}
  notStarted={stats.notStarted}
        />
      </section>

      {/* =========================================
          BOTTOM ROW
      ========================================== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Quick Actions
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Jump to what you need
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {/* Add Topic */}
            <Link
              href="/dashboard/topics"
              className="group flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                +
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Add Topic
                </p>

                <p className="text-xs text-slate-400">
                  Create a new study topic
                </p>
              </div>

              <span className="ml-auto text-slate-300 group-hover:text-indigo-500">
                →
              </span>
            </Link>

            {/* Topics / Progress */}
            <Link
              href="/dashboard/topics"
              className="group flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                📊
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  View Progress
                </p>

                <p className="text-xs text-slate-400">
                  Check your learning progress
                </p>
              </div>

              <span className="ml-auto text-slate-300 group-hover:text-indigo-500">
                →
              </span>
            </Link>

            {/* AI Tutor */}
            <Link
              href="/dashboard/ai-tutor"
              className="group flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-purple-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                ✨
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Ask AI Tutor
                </p>

                <p className="text-xs text-slate-400">
                  Get help with a topic
                </p>
              </div>

              <span className="ml-auto text-slate-300 group-hover:text-purple-500">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Motivation / AI */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-purple-400/20" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl">
              ✨
            </div>

            <p className="mt-5 text-sm font-semibold text-indigo-100">
              Need some help?
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Learn something new today.
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-indigo-100">
              Ask the AI Tutor to explain a difficult concept
              in simple language with examples.
            </p>

            <Link
              href="/dashboard/ai-tutor"
              className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Ask AI Tutor →
            </Link>
          </div>
        </section>
      </section>

      {/* =========================================
          MOTIVATIONAL FOOTER
      ========================================== */}
      <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-indigo-50 p-5 ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            🚀
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              You're doing great!
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Small progress every day adds up to big results.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/topics"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Continue Learning →
        </Link>
      </section>
    </div>
  );
}