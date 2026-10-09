interface OverallProgressProps {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
}

export default function OverallProgress({
  completed,
  inProgress,
  pending,
  total,
}: OverallProgressProps) {
 const percentage =
  total > 0
    ? Math.round((completed / total) * 100)
    : 0;

  const completedAngle = percentage * 3.6;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div>
        <h2 className="text-sm font-bold text-slate-900">
          Overall Progress
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Your complete learning overview.
        </p>
      </div>

      <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
        {/* Donut */}
        <div
          className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              #16a34a 0deg ${completedAngle}deg,
              #e2e8f0 ${completedAngle}deg 360deg
            )`,
          }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-3xl font-bold text-slate-900">
              {percentage}%
            </span>

            <span className="mt-1 text-xs text-slate-400">
              completed
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full max-w-[190px] space-y-4">
          <ProgressLegend
            label="Completed"
            value={completed}
            dotClassName="bg-emerald-500"
          />

          <ProgressLegend
            label="In Progress"
            value={inProgress}
            dotClassName="bg-blue-500"
          />

          <ProgressLegend
            label="Pending"
            value={pending}
            dotClassName="bg-orange-400"
          />
        </div>
      </div>
    </section>
  );
}

interface ProgressLegendProps {
  label: string;
  value: number;
  dotClassName: string;
}

function ProgressLegend({
  label,
  value,
  dotClassName,
}: ProgressLegendProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClassName}`}
        />

        <span className="text-xs text-slate-500">
          {label}
        </span>
      </div>

      <span className="text-xs font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}