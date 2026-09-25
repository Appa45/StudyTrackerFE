import Link from "next/link";

export interface TopicHeaderData {
  id: string;
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Not Started" | "In Progress" | "Completed";
  description: string;
}

interface TopicHeaderProps {
  topic: TopicHeaderData;
}

export default function TopicHeader({
  topic,
}: TopicHeaderProps) {
  const statusClass =
    topic.status === "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : topic.status === "In Progress"
        ? "bg-blue-50 text-blue-700"
        : "bg-orange-50 text-orange-600";

  const topicIcon =
    topic.subject === "Frontend"
      ? "⚛️"
      : topic.subject === "JavaScript"
        ? "JS"
        : topic.subject === "Backend"
          ? "◈"
          : topic.subject === "Database"
            ? "DB"
            : "📚";

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-400"
      >
        <Link
          href="/dashboard"
          className="hover:text-indigo-600"
        >
          Dashboard
        </Link>

        <span>/</span>

        <Link
          href="/dashboard/topics"
          className="hover:text-indigo-600"
        >
          My Topics
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-600">
          {topic.title}
        </span>
      </nav>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Topic information */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-600">
            {topicIcon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                {topic.subject}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                {topic.difficulty}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass}`}
              >
                {topic.status}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {topic.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {topic.description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <Link
            href={`/dashboard/topics/${topic.id}/edit`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Edit Topic
          </Link>

          <Link
            href="/dashboard/topics"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            ← All Topics
          </Link>
        </div>
      </div>
    </section>
  );
}