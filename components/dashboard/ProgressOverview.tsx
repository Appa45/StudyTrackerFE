interface ProgressOverviewProps {
  progress: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export default function ProgressOverview({
  progress,
  completed,
  inProgress,
  notStarted,
}: ProgressOverviewProps) {
  const progressItems = [
    {
      label: "Completed",
      value: completed,
      color: "bg-emerald-500",
    },
    {
      label: "In Progress",
      value: inProgress,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      value: notStarted,
      color: "bg-orange-400",
    },
  ];

  const total = completed + inProgress + notStarted;

  const percentage =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  console.log("percentage",percentage, progress,
  completed,
  inProgress,
  notStarted,)
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">

      <div>
        <h2 className="text-sm font-bold text-slate-900">
          Overall Progress
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Your learning overview
        </p>
      </div>

      <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">

        {/* Donut */}
        <div
          className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              #16a34a ${percentage * 3.6}deg,
              #e2e8f0 ${percentage * 3.6}deg
            )`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-slate-900">
              {percentage}%
            </span>

            <span className="text-[10px] text-slate-400">
              completed
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full max-w-[180px] space-y-4">

          {progressItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                />

                <span className="text-xs text-slate-500">
                  {item.label}
                </span>

              </div>

              <span className="text-xs font-semibold text-slate-700">
                {item.value}
              </span>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}