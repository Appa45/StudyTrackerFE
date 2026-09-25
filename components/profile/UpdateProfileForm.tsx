"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
}

interface Props {
  user: User;
}

export default function UpdateProfileForm({ user }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    preferredDifficulty:
      user.preferredDifficulty || "Beginner",
    dailyStudyGoal: user.dailyStudyGoal?.toString() || "60",
    preferredStudyTime:
      user.preferredStudyTime || "Morning",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            bio: form.bio.trim(),
            preferredDifficulty:
              form.preferredDifficulty,
            dailyStudyGoal:
              Number(form.dailyStudyGoal),
            preferredStudyTime:
              form.preferredStudyTime,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update profile."
        );
      }

      setSuccess("Profile updated successfully.");

      router.refresh();

      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 700);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Personal Information */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your basic profile information.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="Full Name"
            value={form.name}
            onChange={(value) =>
              updateField("name", value)
            }
            required
          />

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              value={user.email}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
            />

            <p className="mt-1 text-xs text-slate-400">
              Email address cannot be changed here.
            </p>
          </div>

          <FormField
            label="Phone Number"
            value={form.phone}
            onChange={(value) =>
              updateField("phone", value)
            }
            placeholder="Enter phone number"
          />

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Daily Study Goal
            </label>

            <div className="relative mt-2">
              <input
                type="number"
                min={5}
                max={720}
                value={form.dailyStudyGoal}
                onChange={(e) =>
                  updateField(
                    "dailyStudyGoal",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                minutes
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Bio
            </label>

            <textarea
              rows={4}
              maxLength={500}
              value={form.bio}
              onChange={(e) =>
                updateField("bio", e.target.value)
              }
              placeholder="Tell us a little about yourself..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.bio.length}/500
            </p>
          </div>
        </div>
      </section>

      {/* Learning Preferences */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">
          Learning Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customize how you want to learn.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Preferred Difficulty
            </label>

            <select
              value={form.preferredDifficulty}
              onChange={(e) =>
                updateField(
                  "preferredDifficulty",
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Preferred Study Time
            </label>

            <select
              value={form.preferredStudyTime}
              onChange={(e) =>
                updateField(
                  "preferredStudyTime",
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Morning">
                Morning
              </option>

              <option value="Afternoon">
                Afternoon
              </option>

              <option value="Evening">
                Evening
              </option>

              <option value="Night">
                Night
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/dashboard/profile")
          }
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}