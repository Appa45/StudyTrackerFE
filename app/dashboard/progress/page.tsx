import Link from "next/link";

import ProgressStatCard from "../../../components/progress/ProgressStatCard";
import OverallProgress from "../../../components/progress/OverallProgress";
import SubjectProgress from "../../../components/progress/SubjectProgress";
import RecentActivity from "../../../components/progress/RecentActivity";

// // const subjectProgress = [
//   {
//     subject: "JavaScript",
//     progress: 85,
//     completed: 5,
//     total: 6,
//     colorClass: "bg-blue-500",
//   },
//   {
//     subject: "React",
//     progress: 70,
//     completed: 4,
//     total: 6,
//     colorClass: "bg-emerald-500",
//   },
//   {
//     subject: "Node.js",
//     progress: 50,
//     completed: 2,
//     total: 4,
//     colorClass: "bg-orange-500",
//   },
//   {
//     subject: "PostgreSQL",
//     progress: 35,
//     completed: 1,
//     total: 3,
//     colorClass: "bg-violet-500",
//   },
// ];

// const recentActivity = [
//   {
//     id: "1",
//     title: "Completed React Hooks",
//     description: "Frontend • Advanced Hooks",
//     time: "2h ago",
//     icon: "✓",
//     iconClassName: "bg-emerald-50 text-emerald-600",
//   },
//   {
//     id: "2",
//     title: "Completed JavaScript Promises",
//     description: "JavaScript • Async Programming",
//     time: "1d ago",
//     icon: "✓",
//     iconClassName: "bg-emerald-50 text-emerald-600",
//   },
//   {
//     id: "3",
//     title: "Started Node.js APIs",
//     description: "Backend • REST APIs",
//     time: "2d ago",
//     icon: "▶",
//     iconClassName: "bg-blue-50 text-blue-600",
//   },
//   {
//     id: "4",
//     title: "Added PostgreSQL Basics",
//     description: "Database • SQL Fundamentals",
//     time: "3d ago",
//     icon: "+",
//     iconClassName: "bg-indigo-50 text-indigo-600",
//   },
// ];

export default function ProgressPage() {
  const totalTopics = 12;
  const completedTopics = 8;
  const inProgressTopics = 3;
  const pendingTopics = 1;

  const overallPercentage = Math.round(
    (completedTopics / totalTopics) * 100
  );

  return (
    <div className="space-y-6">

      {/* =========================================
          HEADER
      ========================================== */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Learning analytics
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Your Progress
          </h1>

          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Track your learning journey and see where you
            are improving.
          </p>
        </div>

        <Link
          href="/dashboard/topics"
          className="w-fit rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue Learning →
        </Link>
      </section>


      {/* =========================================
          STATS
      ========================================== */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <ProgressStatCard
          title="Total Topics"
          value={totalTopics}
          description="Topics in your plan"
          icon="📚"
          iconClassName="bg-indigo-50 text-indigo-600"
        />

        <ProgressStatCard
          title="Completed"
          value={completedTopics}
          description={`${overallPercentage}% completed`}
          icon="✓"
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <ProgressStatCard
          title="In Progress"
          value={inProgressTopics}
          description="Currently learning"
          icon="◷"
          iconClassName="bg-blue-50 text-blue-600"
        />

        <ProgressStatCard
          title="Pending"
          value={pendingTopics}
          description="Still to start"
          icon="□"
          iconClassName="bg-orange-50 text-orange-500"
        />

      </section>


      {/* =========================================
          OVERALL + ACTIVITY
      ========================================== */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">

        <OverallProgress
          completed={completedTopics}
          inProgress={inProgressTopics}
          pending={pendingTopics}
          total={totalTopics}
        />

        {/* <RecentActivity items={recentActivity} /> */}

      </section>


      {/* =========================================
          SUBJECT PROGRESS
      ========================================== */}
      {/* <SubjectProgress items={subjectProgress} /> */}


      {/* =========================================
          LEARNING INSIGHT
      ========================================== */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-emerald-50 p-5 ring-1 ring-slate-100 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              💡
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Keep your momentum going
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
                Your strongest area is JavaScript. Spend a little
                more time on PostgreSQL and Node.js to balance
                your learning progress.
              </p>
            </div>

          </div>

          <Link
            href="/dashboard/topics"
            className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View Topics →
          </Link>

        </div>

      </section>

    </div>
  );
}