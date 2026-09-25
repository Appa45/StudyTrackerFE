import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl">
              🎓
            </div>

            <div>
              <h1 className="text-xl font-bold text-indigo-600">
                StudyTrack
              </h1>

              <p className="text-[10px] text-slate-500">
                Learn. Track. Improve.
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              How it works
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              About
            </a>

          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Sign Up
            </Link>

          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />

        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-purple-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">

          {/* Hero content */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              ✨ Learn smarter, grow faster
            </div>

            <h2 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Plan.
              <span className="text-indigo-600">
                {" "}Learn.
              </span>
              <br />
              Improve.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              StudyTrack helps you organize your learning,
              track your progress, and get AI-powered help
              whenever you need it.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/register"
                className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Get Started →
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Login
              </Link>

            </div>

            {/* Small trust message */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">

              <span className="flex items-center gap-2">
                ✓ Track your topics
              </span>

              <span className="flex items-center gap-2">
                ✓ Monitor progress
              </span>

              <span className="flex items-center gap-2">
                ✓ AI assistance
              </span>

            </div>

          </div>


          {/* Hero dashboard preview */}
          <div className="relative">

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-indigo-100">

              {/* Fake browser header */}
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">

                <div className="h-3 w-3 rounded-full bg-red-300" />
                <div className="h-3 w-3 rounded-full bg-yellow-300" />
                <div className="h-3 w-3 rounded-full bg-green-300" />

                <div className="ml-3 h-7 flex-1 rounded-lg bg-slate-50" />

              </div>


              {/* Dashboard */}
              <div className="grid grid-cols-4 gap-3">

                {/* Sidebar */}
                <div className="hidden rounded-xl bg-slate-50 p-3 sm:block">

                  <div className="mb-6 text-sm font-bold text-indigo-600">
                    StudyTrack
                  </div>

                  <div className="space-y-3 text-xs text-slate-500">

                    <div className="rounded-lg bg-indigo-100 px-3 py-2 text-indigo-700">
                      Dashboard
                    </div>

                    <div className="px-3 py-2">
                      My Topics
                    </div>

                    <div className="px-3 py-2">
                      Progress
                    </div>

                    <div className="px-3 py-2">
                      AI Tutor
                    </div>

                  </div>

                </div>


                {/* Main preview */}
                <div className="col-span-4 space-y-4 sm:col-span-3">

                  <div>
                    <p className="text-xs text-slate-400">
                      Good morning 👋
                    </p>

                    <h3 className="text-lg font-bold">
                      Your Learning Dashboard
                    </h3>
                  </div>


                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-indigo-50 p-3">
                      <p className="text-[10px] text-slate-500">
                        Topics
                      </p>

                      <p className="mt-1 text-xl font-bold text-indigo-600">
                        12
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-[10px] text-slate-500">
                        Completed
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-600">
                        8
                      </p>
                    </div>

                    <div className="rounded-xl bg-orange-50 p-3">
                      <p className="text-[10px] text-slate-500">
                        Progress
                      </p>

                      <p className="mt-1 text-xl font-bold text-orange-500">
                        67%
                      </p>
                    </div>

                  </div>


                  {/* Topics */}
                  <div className="rounded-xl border border-slate-100 p-4">

                    <div className="mb-4 flex items-center justify-between">

                      <h4 className="text-sm font-bold">
                        Today's Topics
                      </h4>

                      <span className="text-xs text-indigo-600">
                        View all
                      </span>

                    </div>


                    <div className="space-y-4">

                      <TopicPreview
                        title="React Hooks"
                        subject="Frontend"
                        progress={80}
                        status="Completed"
                      />

                      <TopicPreview
                        title="JavaScript Promises"
                        subject="JavaScript"
                        progress={55}
                        status="In Progress"
                      />

                      <TopicPreview
                        title="Node.js APIs"
                        subject="Backend"
                        progress={20}
                        status="Pending"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="bg-slate-50 px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold text-indigo-600">
              FEATURES
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Everything you need to stay on track
            </h2>

            <p className="mt-4 text-slate-600">
              Keep your learning organized and understand
              where you need to improve.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <FeatureCard
              icon="📚"
              title="Organize Topics"
              description="Create and manage your study topics in one simple place."
            />

            <FeatureCard
              icon="📊"
              title="Track Progress"
              description="See your learning progress and understand which areas need attention."
            />

            <FeatureCard
              icon="🤖"
              title="AI Tutor"
              description="Ask questions and get simple AI-powered explanations whenever you need help."
            />

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="font-semibold text-indigo-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Start learning in three simple steps
            </h2>

          </div>


          <div className="mt-12 grid gap-8 md:grid-cols-3">

            <Step
              number="01"
              title="Create your topics"
              description="Add the subjects and topics you want to learn."
            />

            <Step
              number="02"
              title="Track your progress"
              description="Update your progress as you complete each topic."
            />

            <Step
              number="03"
              title="Get AI help"
              description="Ask the AI Tutor when you need a simpler explanation."
            />

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-indigo-600 px-8 py-14 text-center text-white md:px-16">

          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to improve your learning?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Start organizing your study journey with
            StudyTrack today.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Create Free Account →
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer
        id="about"
        className="border-t border-slate-100 bg-white"
      >

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="font-bold text-indigo-600">
              StudyTrack
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Plan. Learn. Improve.
            </p>

          </div>

          <p className="text-sm text-slate-400">
            © 2026 StudyTrack. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}


/* ================= COMPONENTS ================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}


function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-slate-600">
        {description}
      </p>

    </div>
  );
}


function TopicPreview({
  title,
  subject,
  progress,
  status,
}: {
  title: string;
  subject: string;
  progress: number;
  status: string;
}) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold">
            {title}
          </p>

          <p className="text-[10px] text-slate-400">
            {subject}
          </p>

        </div>

        <span className="text-[10px] font-medium text-slate-500">
          {status}
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-indigo-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}