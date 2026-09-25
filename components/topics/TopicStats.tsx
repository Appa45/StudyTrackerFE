interface TopicStatsProps {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  targetDate: string;
}

export default function TopicStats({
  progress,
  completedLessons,
  totalLessons,
  targetDate,
}: TopicStatsProps) {
  const remainingLessons =
    totalLessons - completedLessons;

  const stats = [
    {
      label: "Progress",
      value: `${progress}%`,
      icon: "📈",
    },
    {
      label: "Lessons",
      value: `${completedLessons}/${totalLessons}`,
      icon: "📚",
    },
    {
      label: "Remaining",
      value: `${remainingLessons}`,
      icon: "◷",
    },
    {
      label: "Target Date",
      value: targetDate,
      icon: "📅",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
        >
          <div className="flex items-start justify-between gap-3">

            <div>
              <p className="text-xs text-slate-400">
                {stat.label}
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {stat.value}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              {stat.icon}
            </div>

          </div>
        </div>
      ))}
    </section>
  );
}