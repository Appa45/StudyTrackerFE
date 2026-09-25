interface TopicInformationProps {
  subject: string;
  difficulty: string;
  estimatedTime: string;
  targetDate: string;
  status: string;
}

export default function TopicInformation({
  subject,
  difficulty,
  estimatedTime,
  targetDate,
  status,
}: TopicInformationProps) {
  const information = [
    {
      label: "Subject",
      value: subject,
    },
    {
      label: "Difficulty",
      value: difficulty,
    },
    {
      label: "Estimated time",
      value: estimatedTime,
    },
    {
      label: "Target date",
      value: targetDate,
    },
    {
      label: "Status",
      value: status,
    },
  ];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <h2 className="text-sm font-bold text-slate-900 sm:text-base">
        Topic Information
      </h2>

      <p className="mt-1 text-xs text-slate-400">
        Details about your current learning plan.
      </p>

      <div className="mt-6 space-y-4">
        {information.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-xs text-slate-400">
              {item.label}
            </span>

            <span className="text-right text-xs font-semibold text-slate-700">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}