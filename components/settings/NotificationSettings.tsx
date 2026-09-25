"use client";

import { useState } from "react";

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;

  preferredStudyTime?: "Morning" | "Afternoon" | "Evening" | "Night";

  preferences?: {
    dailyGoal?: number;
    preferredDifficulty?: "Beginner" | "Intermediate" | "Advanced";
  };

  notifications?: {
    emailUpdates?: boolean;
    studyReminders?: boolean;
    weeklySummary?: boolean;
  };

  role?: "student" | "admin";
}

interface NotificationSettingsProps {
  initialProfile: UserProfile | null;
}

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-4 last:border-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettings({
  initialProfile,
}: NotificationSettingsProps) {
  const [emailUpdates, setEmailUpdates] = useState(
    initialProfile?.notifications?.emailUpdates ?? true
  );

  const [studyReminders, setStudyReminders] = useState(
    initialProfile?.notifications?.studyReminders ?? true
  );

  const [weeklySummary, setWeeklySummary] = useState(
    initialProfile?.notifications?.weeklySummary ?? false
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifications: {
            emailUpdates,
            studyReminders,
            weeklySummary,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to update notification settings."
        );
      }

      setMessage(
        result?.message ||
          "Notification settings updated successfully."
      );
    } catch (err) {
      console.error("Notification update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update notification settings."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Notification options */}
      <div>
        <ToggleRow
          title="Email updates"
          description="Receive important updates about your StudyTrack account."
          checked={emailUpdates}
          onChange={setEmailUpdates}
        />

        <ToggleRow
          title="Study reminders"
          description="Get reminders when you have pending study topics."
          checked={studyReminders}
          onChange={setStudyReminders}
        />

        <ToggleRow
          title="Weekly summary"
          description="Receive a weekly summary of your learning progress."
          checked={weeklySummary}
          onChange={setWeeklySummary}
        />
      </div>

      {/* Success message */}
      {message && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save notifications"}
        </button>
      </div>
    </div>
  );
}