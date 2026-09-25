interface SubjectProgressItem {
  subject: string;
  progress: number;
  completed: number;
  total: number;
  colorClass?: string;
}

interface SubjectProgressProps {
  items: SubjectProgressItem[];
}

export default function SubjectProgress({
  items,
}: SubjectProgressProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div>
        <h2 className="text-sm font-bold text-slate-900">
          Progress by Subject
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          See how you're doing across each subject.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.subject}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {item.subject}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {item.completed} of {item.total} topics completed
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-slate-600">
                {item.progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  item.colorClass ?? "bg-indigo-500"
                }`}
                style={{
                  width: `${item.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}