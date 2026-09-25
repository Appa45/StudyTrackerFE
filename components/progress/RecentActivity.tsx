interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  iconClassName?: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

export default function RecentActivity({
  items,
}: RecentActivityProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your latest learning activity.
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all →
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                item.iconClassName ??
                "bg-indigo-50 text-indigo-600"
              }`}
            >
              {item.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">
                {item.title}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {item.description}
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-slate-400">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}