import Link from "next/link";

interface TopicCardProps {
  id: string;
  title: string;
  subject: string;
  progress: number;
  status: "Completed" | "In Progress" | "Pending" | "Not Started";
}

export default function TopicCard({
  id,
  title,
  subject,
  progress,
  status,
}: TopicCardProps) {
  const isCompleted = status === "Completed";
  const isInProgress = status === "In Progress";

  const statusStyles = isCompleted
    ? "bg-emerald-50 text-emerald-700"
    : isInProgress
      ? "bg-blue-50 text-blue-700"
      : "bg-pink-50 text-pink-600";

  return (
    <Link
      href={`/dashboard/topics/${id}`}
      className="group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-slate-50 sm:px-3"
    >

      {/* Status */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
          isCompleted
            ? "bg-emerald-50 text-emerald-600"
            : isInProgress
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {isCompleted ? "✓" : isInProgress ? "●" : "○"}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {subject}
        </p>
      </div>

      {/* Progress */}
      <div className="hidden w-28 sm:block">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              isCompleted
                ? "bg-emerald-500"
                : isInProgress
                  ? "bg-blue-500"
                  : "bg-slate-300"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Status badge */}
      <span
        className={`hidden rounded-full px-2.5 py-1 text-[10px] font-medium sm:block ${statusStyles}`}
      >
        {status}
      </span>

      <span className="text-slate-300 transition group-hover:text-indigo-500">
        →
      </span>

    </Link>
  );
}