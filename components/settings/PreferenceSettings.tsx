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

interface PreferenceSettingsProps {
  initialProfile: UserProfile | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PreferenceSettings({
  initialProfile,
}: PreferenceSettingsProps) {
  const [difficulty, setDifficulty] = useState(
    initialProfile?.preferences?.preferredDifficulty ?? "Intermediate"
  );

  const [dailyGoal, setDailyGoal] = useState(
    initialProfile?.preferences?.dailyGoal ?? 60
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
          preferredDifficulty: difficulty,
          dailyStudyGoal: Number(dailyGoal),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to update preferences."
        );
      }

      setMessage(
        result?.message || "Learning preferences updated successfully."
      );
    } catch (err) {
      console.error("Preference update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update preferences."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">

      {/* Difficulty */}
      <div>
        <label
          htmlFor="preferred-difficulty"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Preferred difficulty
        </label>

        <select
          id="preferred-difficulty"
          value={difficulty}
          onChange={(event) =>
            setDifficulty(
              event.target.value as
                | "Beginner"
                | "Intermediate"
                | "Advanced"
            )
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <p className="mt-1.5 text-xs text-slate-400">
          Choose the difficulty level that best matches your current
          learning level.
        </p>
      </div>

      {/* Daily study goal */}
      <div>
        <label
          htmlFor="daily-study-goal"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Daily study goal
        </label>

        <div className="relative">
          <input
            id="daily-study-goal"
            type="number"
            min={15}
            max={1440}
            value={dailyGoal}
            onChange={(event) =>
              setDailyGoal(Number(event.target.value))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            minutes
          </span>
        </div>

        <p className="mt-1.5 text-xs text-slate-400">
          Set how many minutes you want to study each day.
        </p>
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
          {isSaving ? "Saving..." : "Save preferences"}
        </button>
      </div>
    </div>
  );
}