import { cookies } from "next/headers";

import UpdateProfileForm from "../../../../components/profile/UpdateProfileForm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";

  preferences: {
    dailyGoal: number;
    preferredDifficulty:
      | "Beginner"
      | "Intermediate"
      | "Advanced";
  };

  notifications: {
    emailUpdates: boolean;
    studyReminders: boolean;
    weeklySummary: boolean;
  };

  createdAt?: string;
  updatedAt?: string;
}

interface ProfileResponse {
  success: boolean;
  data?: User;
  user?: User;
  message?: string;
}

export default async function EditProfilePage() {
  const cookieStore = await cookies();

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/users/profile`,
      {
        method: "GET",

        headers: {
          Cookie: cookieStore.toString(),
        },

        cache: "no-store",
      }
    );
  } catch (error) {
    console.error(
      "Profile API request failed:",
      error
    );

    throw new Error(
      "Unable to connect to the profile service."
    );
  }

  const result: ProfileResponse =
    await response
      .json()
      .catch(() => ({
        success: false,
      }));

  console.log("Profile API response:", {
    status: response.status,
    result,
  });

  if (response.status === 401) {
    throw new Error(
      "You are not authenticated. Please login again."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        `Unable to load profile. Server returned ${response.status}.`
    );
  }

  const user = result.data ?? result.user;

  if (!user) {
    throw new Error(
      "Profile information was not returned by the server."
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Update Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update your personal information and
          learning preferences.
        </p>
      </div>

      {/* Form */}
      <UpdateProfileForm user={user} />

    </div>
  );
}