
import Link from "next/link";
import { cookies } from "next/headers";
import axios from "axios";


const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role?: string;
  preferredDifficulty?: "Beginner" | "Intermediate" | "Advanced";
  dailyStudyGoal?: number;
  preferredStudyTime?: string;
  preferences?: {
    dailyGoal?: number;
    preferredDifficulty?: "Beginner" | "Intermediate" | "Advanced";
  };
  createdAt?: string;
}

interface ProfileResponse {
  success: boolean;
  data?: User;
  user?: User;
  message?: string;
  error?: string;
}

// async function getUserProfile(): Promise<{
//   user: User | null;
//   error: string;
// }> {
//   try {
//     const cookieStore = await cookies();
//     const cookieHeader = cookieStore.toString();

//        console.log("cookies seen by server:", cookieStore.getAll().map((c) => c.name));
//     const response = await fetch(`${API_URL}/users/profile`, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         ...(cookieHeader ? { Cookie: cookieHeader } : {}),
//       },
//       cache: "no-store",
//     });

//     console.log("res",response)

//     const result: ProfileResponse = await response
//       .json()
//       .catch(() => ({ success: false }));

//     if (response.status === 401 || response.status === 403) {
//       console.error(
//         "Profile authentication failed:",
//         response.status,
//         result.message || result.error || "No error message returned"
//       );

//       return {
//         user: null,
//         error:
//           "The profile API rejected your authentication. Your page has not logged you out. Please verify that your login cookie is available and valid.",
//       };
//     }

//     if (!response.ok) {
//       console.error("Profile API failed:", response.status, result);

//       return {
//         user: null,
//         error:
//           result.message ||
//           result.error ||
//           `Unable to load profile (HTTP ${response.status}).`,
//       };
//     }

//     const user = result.data ?? result.user;

//     if (!result.success || !user) {
//       console.error("Invalid profile response:", result);

//       return {
//         user: null,
//         error: result.message || "Profile information was not found.",
//       };
//     }

//     return { user, error: "" };
//   } catch (error) {
//     console.error("Profile request failed:", error);

//     return {
//       user: null,
//       error: "Unable to connect to the profile service. Please try again.",
//     };
//   }
// }





async function getUserProfile(): Promise<{
  user: User | null;
  error: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await axios.get<ProfileResponse>(
      `${API_URL.replace(/\/+$/, "")}/users/profile`,
      {
        headers: {
          Accept: "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        timeout: 15000,
      }
    );

    const result = response.data;
    const user = result.data ?? result.user;

    if (!result.success || !user) {
      return {
        user: null,
        error: result.message || "Profile information was not found.",
      };
    }

    return { user, error: "" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Profile API error:", {
        status: error.response?.status,
        message: error.response?.data?.message ?? error.message,
        url: error.config?.url,
      });

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        return {
          user: null,
          error: "Your profile request was not authenticated. Please check your session.",
        };
      }

      return {
        user: null,
        error:
          error.code === "ECONNABORTED" ||
          error.code === "ETIMEDOUT"
            ? "The profile service timed out. Please try again."
            : error.response?.data?.message ||
              "Unable to load your profile.",
      };
    }

    console.error("Unexpected profile error:", error);

    return {
      user: null,
      error: "Unable to connect to the profile service.",
    };
  }
}


export default async function ProfilePage() {
  const { user, error } = await getUserProfile();

  // Show an error rather than automatically redirecting to login.
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          My Profile
        </h1>

        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          <p className="font-semibold">Unable to load your profile</p>
          <p className="mt-2">{error}</p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </Link>

        <p className="text-sm text-slate-500">
          If your session has actually expired, you can{" "}
          <Link
            href="/login?next=%2Fdashboard%2Fprofile"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            sign in again
          </Link>
          .
        </p>
      </div>
    );
  }

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const joinedDate = user.createdAt
    ? (() => {
        const date = new Date(user.createdAt);

        return Number.isNaN(date.getTime())
          ? "Not available"
          : new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(date);
      })()
    : "Not available";

  const preferredDifficulty =
    user.preferences?.preferredDifficulty ??
    user.preferredDifficulty ??
    "Not specified";

  const dailyStudyGoal =
    user.preferences?.dailyGoal ?? user.dailyStudyGoal;

  const preferredStudyTime =
    user.preferredStudyTime || "Not specified";

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
                  alt={`${user.name}'s profile`}
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
          <ProfileField label="Full Name" value={user.name} />
          <ProfileField label="Email Address" value={user.email} />
          <ProfileField
            label="Phone Number"
            value={user.phone || "Not provided"}
          />
          <ProfileField label="Member Since" value={joinedDate} />

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
            value={preferredDifficulty}
          />

          <ProfileField
            label="Daily Study Goal"
            value={
              dailyStudyGoal != null
                ? `${dailyStudyGoal} minutes`
                : "Not specified"
            }
          />

          <ProfileField
            label="Preferred Study Time"
            value={preferredStudyTime}
          />
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
        <p className="break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}
