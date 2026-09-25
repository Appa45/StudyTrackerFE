import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}