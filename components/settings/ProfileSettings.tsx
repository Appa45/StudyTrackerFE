"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  preferredStudyTime?: "Morning" | "Afternoon" | "Evening" | "Night";
  role?: "student" | "admin";

  preferences?: {
    dailyGoal?: number;
    preferredDifficulty?: "Beginner" | "Intermediate" | "Advanced";
  };

  notifications?: {
    emailUpdates?: boolean;
    studyReminders?: boolean;
    weeklySummary?: boolean;
  };
}

interface ProfileSettingsProps {
  initialProfile: UserProfile | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProfileSettings({
  initialProfile,
}: ProfileSettingsProps) {
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [email] = useState(initialProfile?.email ?? "");

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
          name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to update profile."
        );
      }

      setMessage(
        result?.message || "Profile updated successfully."
      );
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const initials =
    name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="space-y-5">

      {/* Avatar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-700">
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Profile photo
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your profile avatar is shown in the dashboard.
          </p>

          <button
            type="button"
            className="mt-3 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <FormInput
          id="settings-name"
          name="name"
          label="Full name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <FormInput
          id="settings-email"
          name="email"
          label="Email address"
          type="email"
          value={email}
          disabled
          onChange={() => {}}
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

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>

    </div>
  );
}