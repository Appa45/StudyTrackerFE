import Link from "next/link";
import { cookies } from "next/headers";

import SettingsSection from "../../../components/settings/SettingsSection";
import ProfileSettings from "../../../components/settings/ProfileSettings";
import PreferenceSettings from "../../../components/settings/PreferenceSettings";
import NotificationSettings from "../../../components/settings/NotificationSettings";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;

  phone?: string;
  bio?: string;

  preferredStudyTime?:
    | "Morning"
    | "Afternoon"
    | "Evening"
    | "Night";

  preferences?: {
    dailyGoal?: number;

    preferredDifficulty?:
      | "Beginner"
      | "Intermediate"
      | "Advanced";
  };

  notifications?: {
    emailUpdates?: boolean;
    studyReminders?: boolean;
    weeklySummary?: boolean;
  };

  role?: "student" | "admin";

  createdAt?: string;
  updatedAt?: string;
}

interface ProfileResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
}

export default async function SettingsPage() {
  const cookieStore = await cookies();

  /*
   * --------------------------------------------------
   * Fetch logged-in user profile
   * --------------------------------------------------
   *
   * The request is made from the Next.js server.
   *
   * This avoids making another API request from the
   * browser after the settings page loads.
   */

  let profile: UserProfile | null = null;
  let profileError = "";

  try {
    const response = await fetch(
      `${API_URL}/users/profile`,
      {
        method: "GET",

        headers: {
          Cookie: cookieStore.toString(),
        },

        /*
         * Profile data is user-specific.
         * Don't cache another user's profile.
         */
        cache: "no-store",
      }
    );

    console.log("response",response)

    const result: ProfileResponse =
      await response.json().catch(() => ({
        success: false,
      }));

    if (response.ok && result.success) {
      profile = result.data ?? null;
    } else {
      profileError =
        result.message ||
        "Unable to load profile.";
    }
  } catch (error) {
    console.error(
      "Settings profile API error:",
      error
    );

    profileError =
      "Unable to connect to the profile service.";
  }

  return (
    <div className="space-y-6">

      {/* =========================================
          HEADER
      ========================================== */}

      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-medium text-slate-400">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Manage your profile, learning preferences,
            and notification settings.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          ← Dashboard
        </Link>

      </section>

      {/* =========================================
          API ERROR
      ========================================== */}

      {profileError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {profileError}
        </div>
      )}

      {/* =========================================
          PROFILE
      ========================================== */}

      <SettingsSection
        title="Profile"
        description="Update the information associated with your account."
      >
        <ProfileSettings
          initialProfile={profile}
        />
      </SettingsSection>

      {/* =========================================
          LEARNING PREFERENCES
      ========================================== */}

      <SettingsSection
        title="Learning preferences"
        description="Customize how StudyTrack helps you learn."
      >
        <PreferenceSettings
          initialProfile={profile}
        />
      </SettingsSection>

      {/* =========================================
          NOTIFICATIONS
      ========================================== */}

      <SettingsSection
        title="Notifications"
        description="Choose which notifications you would like to receive."
      >
        <NotificationSettings
          initialProfile={profile}
        />
      </SettingsSection>

      {/* =========================================
          ACCOUNT INFORMATION
      ========================================== */}

      {profile && (
        <SettingsSection
          title="Account information"
          description="Information associated with your StudyTrack account."
        >
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Email */}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                {profile.email}
              </p>
            </div>

            {/* Role */}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Account type
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                {profile.role || "student"}
              </p>
            </div>

            {/* Phone */}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {profile.phone || "Not provided"}
              </p>
            </div>

            {/* Preferred study time */}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Preferred study time
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {profile.preferredStudyTime ||
                  "Not selected"}
              </p>
            </div>

          </div>
        </SettingsSection>
      )}

      {/* =========================================
          DANGER ZONE
      ========================================== */}

      <section className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-100 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-sm font-bold text-red-800">
              Delete account
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-red-600">
              Permanently delete your StudyTrack account
              and associated learning data. This action
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            className="w-fit rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100"
          >
            Delete account
          </button>

        </div>

      </section>

    </div>
  );
}