"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Difficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

type TopicStatus =
  | "Not Started"
  | "In Progress"
  | "Completed";

interface Topic {
  _id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  progress: number;
  status: TopicStatus;
  targetDate: string;
  description?: string;
}

interface TopicResponse {
  success: boolean;
  data?: Topic;
  topic?: Topic;
  message?: string;
}

export default function EditTopicPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    difficulty: "Beginner" as Difficulty,
    progress: 0,
    status: "Not Started" as TopicStatus,
    targetDate: "",
  });

  /*
   * -------------------------------------------------------
   * LOAD TOPIC
   * -------------------------------------------------------
   */
  useEffect(() => {
    if (!id) return;

    const loadTopic = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/topics/${encodeURIComponent(id)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: TopicResponse = await response
          .json()
          .catch(() => ({
            success: false,
          }));

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please login again."
          );
        }

        if (response.status === 404) {
          throw new Error("Topic not found.");
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load topic."
          );
        }

        const topic = result.data ?? result.topic;

        if (!topic) {
          throw new Error(
            "Topic data was not returned by the server."
          );
        }

        /*
         * HTML date input requires:
         * YYYY-MM-DD
         */
        const formattedDate = topic.targetDate
          ? new Date(topic.targetDate)
              .toISOString()
              .split("T")[0]
          : "";

        setForm({
          title: topic.title || "",
          subject: topic.subject || "",
          description: topic.description || "",
          difficulty:
            topic.difficulty || "Beginner",
          progress: topic.progress ?? 0,
          status:
            topic.status || "Not Started",
          targetDate: formattedDate,
        });
      } catch (err) {
        console.error(
          "Failed to load topic:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load topic."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [id]);

  /*
   * -------------------------------------------------------
   * HANDLE INPUT
   * -------------------------------------------------------
   */
  const handleChange = (
    field: keyof typeof form,
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /*
   * -------------------------------------------------------
   * SUBMIT UPDATE
   * -------------------------------------------------------
   */

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  // -----------------------------
  // Validation
  // -----------------------------

  if (!form.title.trim()) {
    setError("Please enter a topic title.");
    return;
  }

  if (!form.subject.trim()) {
    setError("Please enter a subject.");
    return;
  }

  if (!form.description.trim()) {
    setError("Please enter a description.");
    return;
  }

  if (
    form.progress < 0 ||
    form.progress > 100
  ) {
    setError("Progress must be between 0 and 100.");
    return;
  }

  if (!id) {
    setError("Topic ID is missing.");
    return;
  }

  try {
    setSaving(true);

    const url = `${API_URL}/topics/${encodeURIComponent(id)}`;

    console.log("Updating topic:", {
      url,
      id,
      payload: {
        title: form.title.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        progress: Number(form.progress),
        status: form.status,
        targetDate: form.targetDate,
      },
    });

    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        progress: Number(form.progress),
        status: form.status,
        targetDate: form.targetDate,
      }),
    });

    const result = await response
      .json()
      .catch(() => ({
        success: false,
        message: "Invalid server response.",
      }));

    console.log("Update topic response:", {
      status: response.status,
      ok: response.ok,
      result,
    });

    if (response.status === 401) {
      router.replace("/login");
      return;
    }

    if (response.status === 404) {
      throw new Error(
        result.message || "Topic was not found."
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Update failed with status ${response.status}.`
      );
    }

    setSuccess(
      result.message ||
        "Topic updated successfully."
    );

    setTimeout(() => {
      router.push(`/dashboard/topics/${id}`);
      router.refresh();
    }, 700);
  } catch (error) {
    console.error("Update topic error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Unable to update topic."
    );
  } finally {
    setSaving(false);
  }
};



  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading topic...
          </p>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * ERROR
   * -------------------------------------------------------
   */
  if (error && !form.title) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-700">
            Unable to load topic
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/dashboard/topics"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * PAGE
   * -------------------------------------------------------
   */
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div>
        <Link
          href={`/dashboard/topics/${id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Topic
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Edit Topic
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update your topic information and learning
          progress.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
      >

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Topic Title
          </label>

          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(event) =>
              handleChange(
                "title",
                event.target.value
              )
            }
            placeholder="e.g. React Hooks"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Subject
          </label>

          <input
            id="subject"
            type="text"
            value={form.subject}
            onChange={(event) =>
              handleChange(
                "subject",
                event.target.value
              )
            }
            placeholder="e.g. Frontend Development"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(event) =>
              handleChange(
                "description",
                event.target.value
              )
            }
            placeholder="Describe what you want to learn..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Difficulty + Status */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Difficulty */}
          <div>
            <label
              htmlFor="difficulty"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Difficulty
            </label>

            <select
              id="difficulty"
              value={form.difficulty}
              onChange={(event) =>
                handleChange(
                  "difficulty",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              value={form.status}
              onChange={(event) =>
                handleChange(
                  "status",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Not Started">
                Not Started
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>
        </div>

        {/* Progress + Target Date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Progress */}
          <div>
            <label
              htmlFor="progress"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Progress
            </label>

            <div className="flex items-center gap-3">
              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={(event) =>
                  handleChange(
                    "progress",
                    Number(event.target.value)
                  )
                }
                className="w-full accent-indigo-600"
              />

              <span className="w-12 rounded-lg bg-indigo-50 px-2 py-2 text-center text-sm font-bold text-indigo-700">
                {form.progress}%
              </span>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label
              htmlFor="targetDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Target Date
            </label>

            <input
              id="targetDate"
              type="date"
              value={form.targetDate}
              onChange={(event) =>
                handleChange(
                  "targetDate",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Progress preview */}
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Learning Progress
            </span>

            <span className="text-sm font-bold text-indigo-600">
              {form.progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{
                width: `${form.progress}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

          <Link
            href={`/dashboard/topics/${id}`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
}