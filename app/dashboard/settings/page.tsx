
import Link from "next/link";
import { cookies } from "next/headers";

import SettingsSection from "../../../components/settings/SettingsSection";
import ProfileSettings from "../../../components/settings/ProfileSettings";
import PreferenceSettings from "../../../components/settings/PreferenceSettings";
import NotificationSettings from "../../../components/settings/NotificationSettings";

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  preferredStudyTime?: string;
  preferences?: {
    dailyGoal?: number;
    preferredDifficulty?: string;
  };
  notifications?: {
    emailUpdates?: boolean;
    studyReminders?: boolean;
    weeklySummary?: boolean;
  };
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
  error?: string;
}

async function getUserProfile(): Promise<{
  profile: UserProfile | null;
  error: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });

    const result: ProfileResponse = await response.json();

    if (!response.ok) {
      console.error("Profile API failed:", response.status, result);

      return {
        profile: null,
        error:
          result.message ||
          result.error ||
          `Unable to load profile (HTTP ${response.status}).`,
      };
    }

    if (!result.success || !result.data) {
      console.error("Invalid profile API response:", result);

      return {
        profile: null,
        error: result.message || "Profile data was not returned by the API.",
      };
    }

    return {
      profile: result.data,
      error: "",
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return {
      profile: null,
      error:
        "Unable to connect to the profile service. Please try again later.",
    };
  }
}

export default async function SettingsPage() {
  const { profile, error } = await getUserProfile();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-gray-900">
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <span>Settings</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Settings
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage your profile, study preferences, and notifications.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* API error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">Unable to load settings</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Profile settings */}
        <div className="space-y-6">
          <SettingsSection
            title="Profile"
            description="Update your personal information."
          >
            <ProfileSettings initialProfile={profile} />
          </SettingsSection>

          {/* Study preferences */}
          <SettingsSection
            title="Study Preferences"
            description="Customize your daily study goals and learning preferences."
          >
            <PreferenceSettings initialProfile={profile} />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            title="Notifications"
            description="Choose which updates and reminders you receive."
          >
            <NotificationSettings initialProfile={profile} />
          </SettingsSection>

          {/* Account information */}
          {profile && (
            <SettingsSection
              title="Account Information"
              description="Details associated with your account."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Email address</p>
                  <p className="mt-1 break-all font-medium">
                    {profile.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Account role</p>
                  <p className="mt-1 font-medium capitalize">
                    {profile.role || "Student"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Daily study goal</p>
                  <p className="mt-1 font-medium">
                    {profile.preferences?.dailyGoal ?? 60} minutes
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Preferred difficulty
                  </p>
                  <p className="mt-1 font-medium">
                    {profile.preferences?.preferredDifficulty || "Beginner"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Preferred study time
                  </p>
                  <p className="mt-1 font-medium">
                    {profile.preferredStudyTime || "Morning"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="mt-1 font-medium">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not available"}
                  </p>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Danger zone */}
          <SettingsSection
            title="Danger Zone"
            description="Manage actions that affect your account."
          >
            <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-red-800">
                  Delete account
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Account deletion is permanent. Contact support before
                  proceeding.
                </p>
              </div>

              <button
                type="button"
                disabled
                title="Account deletion is not connected yet"
                className="w-fit cursor-not-allowed rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-400"
              >
                Delete Account
              </button>
            </div>
          </SettingsSection>
        </div>
      </div>
    </main>
  );
}
