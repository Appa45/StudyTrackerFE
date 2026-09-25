import Link from "next/link";

interface TopicEmptyStateProps {
  hasSearch: boolean;
}

export default function TopicEmptyState({
  hasSearch,
}: TopicEmptyStateProps) {
  return (
    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-100">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
        {hasSearch ? "⌕" : "📚"}
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        {hasSearch
          ? "No topics found"
          : "No study topics yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
        {hasSearch
          ? "Try another topic name or choose a different subject."
          : "Create your first study topic and start tracking your learning progress."}
      </p>

      {!hasSearch && (
        <Link
          href="/dashboard/topics/new"
          className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Create Topic
        </Link>
      )}

    </div>
  );
}