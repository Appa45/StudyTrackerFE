
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  type?: "login" | "register";
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  type = "login",
}: AuthShellProps) {
  const isRegister = type === "register";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
        
        {/* Main Auth Card */}
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/70 ring-1 ring-slate-200 lg:grid-cols-2">

          {/* ================= LEFT PANEL ================= */}
          <section className="relative hidden min-h-[650px] overflow-hidden bg-indigo-600 lg:flex">

            {/* Background shapes */}
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-500 opacity-50" />

            <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-purple-500 opacity-40" />

            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

            {/* Content */}
            <div className="relative flex w-full flex-col justify-between p-10 xl:p-12">

              {/* Logo */}
              <Link
                href="/"
                className="flex w-fit items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-md">
                  🎓
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    StudyTrack
                  </h1>

                  <p className="text-xs text-indigo-200">
                    Learn. Track. Improve.
                  </p>
                </div>
              </Link>

              {/* Center content */}
              <div className="mx-auto w-full max-w-md text-center">

                <div className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-white/10 text-7xl backdrop-blur-sm">
                  {isRegister ? "🌱" : "📚"}
                </div>

                <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
                  {isRegister ? (
                    <>
                      Start your
                      <br />
                      learning journey.
                    </>
                  ) : (
                    <>
                      Build better
                      <br />
                      learning habits.
                    </>
                  )}
                </h2>

                <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-indigo-100 xl:text-base">
                  {isRegister
                    ? "Create your study space, organize your topics and start making progress every day."
                    : "Organize your topics, track your progress and get help whenever you need it."}
                </p>

                {/* Small highlights */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">

                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white">
                    📚 Organized
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white">
                    📊 Track progress
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white">
                    ✨ AI help
                  </span>

                </div>

              </div>

              {/* Bottom text */}
              <p className="text-sm text-indigo-200">
                ✨ Your learning journey starts here.
              </p>

            </div>
          </section>


          {/* ================= RIGHT PANEL ================= */}
          <section className="flex min-h-[650px] items-center justify-center bg-white px-6 py-10 sm:px-10 xl:px-14">

            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 lg:hidden">
                <Link
                  href="/"
                  className="flex w-fit items-center gap-3"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-sm">
                    🎓
                  </div>

                  <div>
                    <h1 className="font-bold text-slate-900">
                      StudyTrack
                    </h1>

                    <p className="text-[10px] text-slate-500">
                      Learn. Track. Improve.
                    </p>
                  </div>

                </Link>
              </div>

              {/* Header */}
              <div className="mb-7">

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {subtitle}
                </p>

              </div>

              {/* Form */}
              {children}

              {/* Footer */}
              <p className="mt-7 text-center text-sm text-slate-500">
                {footerText}{" "}

                <Link
                  href={footerLinkHref}
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  {footerLinkText}
                </Link>
              </p>

              {/* Back */}
              <div className="mt-5 text-center">
                <Link
                  href="/"
                  className="text-xs text-slate-400 transition hover:text-slate-600"
                >
                  ← Back to home
                </Link>
              </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
