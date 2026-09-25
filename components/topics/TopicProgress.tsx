interface TopicProgressProps {
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function TopicProgress({
  progress,
  completedLessons,
  totalLessons,
}: TopicProgressProps) {
  const remainingLessons =
    totalLessons - completedLessons;

    console.log("learning",completedLessons)

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 sm:text-base">
            Learning Progress
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Track your progress for this topic.
          </p>
        </div>

        <span className="text-lg font-bold text-indigo-600">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Topic progress"
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Lesson summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-600">
            Completed
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {completedLessons}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            lessons
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Remaining
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {remainingLessons}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            lessons
          </p>
        </div>
      </div>
    </section>
  );
}