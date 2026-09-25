import Link from "next/link";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  preferredDifficulty?: "Beginner" | "Intermediate" | "Advanced";
  dailyStudyGoal?: number;
  preferredStudyTime?: string;
  createdAt?: string;
}

interface ProfileResponse {
  success: boolean;
  data?: User;
  user?: User;
  message?: string;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();

  let response: Response;

  try {
    response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Profile API request failed:", error);

    throw new Error("Unable to connect to the profile service.");
  }

  const result: ProfileResponse = await response
    .json()
    .catch(() => ({
      success: false,
    }));

  if (response.status === 401) {
    throw new Error("You are not authenticated. Please login again.");
  }

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to load profile."
    );
  }

  const user = result.data ?? result.user;

  if (!user) {
    throw new Error("Profile information not found.");
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const joinedDate = user.createdAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "Not available";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and learning preferences.
          </p>
        </div>

        <Link
          href="/dashboard/profile/edit"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Edit Profile
        </Link>
      </section>

      {/* Profile Card */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-700 shadow-md">
                  {initials}
                </div>
              )}

              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your basic account information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ProfileField
            label="Full Name"
            value={user.name}
          />

          <ProfileField
            label="Email Address"
            value={user.email}
          />

          <ProfileField
            label="Phone Number"
            value={user.phone || "Not provided"}
          />

          <ProfileField
            label="Member Since"
            value={joinedDate}
          />

          <div className="md:col-span-2">
            <ProfileField
              label="Bio"
              value={user.bio || "No bio added yet."}
            />
          </div>
        </div>
      </section>

      {/* Learning Preferences */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Learning Preferences
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Customize StudyTrack around your learning routine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <ProfileField
            label="Preferred Difficulty"
            value={user.preferredDifficulty || "Not specified"}
          />

          <ProfileField
            label="Daily Study Goal"
            value={
              user.dailyStudyGoal
                ? `${user.dailyStudyGoal} minutes`
                : "Not specified"
            }
          />

          <ProfileField
            label="Preferred Study Time"
            value={user.preferredStudyTime || "Not specified"}
          />
        </div>
      </section>

      {/* Account Actions */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">
          Account
        </h2>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/profile/edit"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Update Profile
          </Link>

          <Link
            href="/dashboard/profile/change-password"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Change Password
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}