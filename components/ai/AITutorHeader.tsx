import Link from "next/link";

export default function AITutorHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">
          Learning assistant
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          AI Tutor ✦
        </h1>

        <p className="mt-1 max-w-xl text-sm text-slate-500">
          Ask questions, understand difficult concepts, and
          get simple explanations.
        </p>
      </div>

      <Link
        href="/dashboard/topics"
        className="w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
      >
        ← My Topics
      </Link>
    </section>
  );
}