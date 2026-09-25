interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  iconClassName?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  iconClassName = "bg-indigo-50 text-indigo-600",
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-xs font-medium text-slate-400 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 hidden text-[11px] text-slate-400 sm:block">
            {description}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm sm:h-11 sm:w-11 ${iconClassName}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}