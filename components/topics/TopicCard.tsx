import Link from "next/link";

export type TopicStatus =
  | "Completed"
  | "In Progress"
  | "Not Started";

export interface Topic {
  id: string;
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  status: TopicStatus;
  targetDate: string;
  description?: string;
  colorClass?: string;
}

interface TopicCardProps {
  topic: Topic;
  onDelete?: (id: string) => void;
  deleting?: boolean;
}

export default function TopicCard({
  topic,
  onDelete,
}: TopicCardProps) {
  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-blue-50 text-blue-700",
    "Not Started": "bg-orange-50 text-orange-600",
  };

  const progressStyles = {
    Completed: "bg-emerald-500",
    "In Progress": "bg-blue-500",
    "Not Started": "bg-slate-300",
  };

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md sm:p-5">

      {/* Top row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        {/* Topic info */}
        <div className="flex min-w-0 items-start gap-3">

          {/* Topic icon */}
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
              topic.colorClass || "bg-indigo-50 text-indigo-600"
            }`}
          >
            {topic.subject === "Frontend"
              ? "⚛️"
              : topic.subject === "JavaScript"
                ? "JS"
                : topic.subject === "Backend"
                  ? "◈"
                  : topic.subject === "Database"
                    ? "🐘"
                    : "📚"}
          </div>

          <div className="min-w-0">

            <Link
              href={`/dashboard/topics/${topic.id}`}
              className="block truncate text-sm font-bold text-slate-900 hover:text-indigo-600 sm:text-base"
            >
              {topic.title}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>{topic.subject}</span>

              <span>•</span>

              <span>{topic.difficulty}</span>
            </div>

          </div>
        </div>


        {/* Actions */}
        <div className="flex items-center gap-2">

          <Link
            href={`/dashboard/topics/${topic.id}/edit`}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete?.(topic.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>

        </div>

      </div>


      {/* Progress */}
      <div className="mt-5 flex items-center gap-3">

        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

          <div
            className={`h-full rounded-full transition-all ${
              progressStyles[topic.status]
            }`}
            style={{
              width: `${topic.progress}%`,
            }}
          />

        </div>

        <span className="w-10 text-right text-xs font-semibold text-slate-600">
          {topic.progress}%
        </span>

      </div>


      {/* Bottom information */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">

          <span className="flex items-center gap-1.5">
            📅 {topic.targetDate}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 font-medium ${
              statusStyles[topic.status]
            }`}
          >
            {topic.status}
          </span>

        </div>

        <Link
          href={`/dashboard/topics/${topic.id}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View topic →
        </Link>

      </div>

    </article>
  );
}