export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 py-3 sm:flex-row">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-slate-700">
            StudyTrack
          </span>
        </p>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="mailto:s.v.ayyappanaik@gmail.com"
            className="text-slate-500 transition hover:text-indigo-600"
          >
            s.v.ayyappanaik@gmail.com
          </a>

          <span className="text-slate-300">•</span>

          <a
            href="https://www.linkedin.com/in/s-v-ayyappa-naik/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}