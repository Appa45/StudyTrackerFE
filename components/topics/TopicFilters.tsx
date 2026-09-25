"use client";

interface TopicFiltersProps {
  search: string;
  subject: string;
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onAddTopic: () => void;
}

const subjects = [
  "All Subjects",
  "Frontend",
  "JavaScript",
  "Backend",
  "Database",
];

export default function TopicFilters({
  search,
  subject,
  onSearchChange,
  onSubjectChange,
  onAddTopic,
}: TopicFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center">

      {/* Search */}
      <div className="relative flex-1">

        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          ⌕
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search topics..."
          aria-label="Search topics"
          className="w-full rounded-xl bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none ring-1 ring-transparent placeholder:text-slate-400 focus:bg-white focus:ring-indigo-200"
        />

      </div>


      {/* Subject filter */}
      <select
        value={subject}
        onChange={(event) =>
          onSubjectChange(event.target.value)
        }
        aria-label="Filter by subject"
        className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none ring-1 ring-transparent focus:bg-white focus:ring-indigo-200"
      >
        {subjects.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>


      {/* Add topic */}
      <button
        type="button"
        onClick={onAddTopic}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        + Add Topic
      </button>

    </div>
  );
}