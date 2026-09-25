"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

interface Lesson {
  _id: string;
  topicId: string;
  title: string;
  description?: string;
  content?: string;

  resourceType?:
    | "none"
    | "image"
    | "pdf"
    | "external";

  resourceUrl?: string;

  completed: boolean;
  completedAt?: string | null;
  order: number;

  createdAt?: string;
  updatedAt?: string;
}

interface SingleLessonResponse {
  success: boolean;

  data?: Lesson;

  progress?: {
    progress: number;
    status:
      | "Not Started"
      | "In Progress"
      | "Completed";
    completedLessons: number;
    totalLessons: number;
  };

  message?: string;
}

interface TopicLessonsProps {
  topicId: string;
  initialLessons: Lesson[];
}

interface LessonForm {
  title: string;
  description: string;
  content: string;

  resourceType:
    | "none"
    | "image"
    | "pdf"
    | "external";

  resourceUrl: string;
}

const initialForm: LessonForm = {
  title: "",
  description: "",
  content: "",
  resourceType: "none",
  resourceUrl: "",
};

export default function TopicLessons({
  topicId,
  initialLessons,
}: TopicLessonsProps) {
  const router = useRouter();

  const [lessons, setLessons] =
    useState<Lesson[]>(initialLessons);

  const [saving, setSaving] =
    useState(false);

  const [completingLessonId, setCompletingLessonId] =
    useState<string | null>(null);

  const [deletingLessonId, setDeletingLessonId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [form, setForm] =
    useState<LessonForm>(initialForm);

  /*
   * --------------------------------------------------
   * Open Add Lesson Modal
   * --------------------------------------------------
   */

  function openAddModal() {
    setError("");
    setForm(initialForm);
    setShowAddModal(true);
  }

  /*
   * --------------------------------------------------
   * Close Add Lesson Modal
   * --------------------------------------------------
   */

  function closeAddModal() {
    if (saving) return;

    setShowAddModal(false);
    setForm(initialForm);
    setError("");
  }

  /*
   * --------------------------------------------------
   * Update Form
   * --------------------------------------------------
   */

  function updateForm(
    field: keyof LessonForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /*
   * --------------------------------------------------
   * Add Lesson
   * --------------------------------------------------
   */

  async function handleAddLesson(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Lesson title is required.");
      return;
    }

    if (title.length < 2) {
      setError(
        "Lesson title must contain at least 2 characters."
      );
      return;
    }

    if (form.description.trim().length > 500) {
      setError(
        "Description cannot exceed 500 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/topics/${encodeURIComponent(
          topicId
        )}/lessons`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            title,

            description:
              form.description.trim(),

            content:
              form.content.trim(),

            resourceType:
              form.resourceType,

            resourceUrl:
              form.resourceUrl.trim(),
          }),
        }
      );

      const result: SingleLessonResponse =
        await response
          .json()
          .catch(() => ({
            success: false,
          }));

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to create lesson."
        );
      }

      /*
       * Add new lesson immediately
       * to local state.
       */
      if (result.data) {
        setLessons((previous) => [
          ...previous,
          result.data!,
        ]);
      }

      /*
       * Close modal.
       */
      setShowAddModal(false);
      setForm(initialForm);

      /*
       * Refresh the server component so
       * TopicStats / TopicProgress receive
       * updated lesson counts.
       *
       * This is much better than:
       *
       * window.location.reload()
       */
      router.refresh();
    } catch (error) {
      console.error(
        "Create lesson error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create lesson."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * --------------------------------------------------
   * Complete Lesson
   *
   * IMPORTANT:
   * A completed lesson cannot be unchecked.
   * --------------------------------------------------
   */

  async function completeLesson(
    lesson: Lesson
  ) {
    /*
     * Already completed?
     *
     * Do absolutely nothing.
     */
    if (lesson.completed) {
      return;
    }

    try {
      setError("");

      setCompletingLessonId(
        lesson._id
      );

      const response = await fetch(
        `${API_URL}/topics/${encodeURIComponent(
          topicId
        )}/lessons/${encodeURIComponent(
          lesson._id
        )}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          /*
           * We ONLY send true.
           *
           * There is no way from this
           * component to send false.
           */
          body: JSON.stringify({
            completed: true,
          }),
        }
      );

      const result: SingleLessonResponse =
        await response
          .json()
          .catch(() => ({
            success: false,
          }));

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to complete lesson."
        );
      }

      /*
       * Update local lesson immediately.
       */
      if (result.data) {
        setLessons((previous) =>
          previous.map((item) =>
            item._id === lesson._id
              ? result.data!
              : item
          )
        );
      } else {
        setLessons((previous) =>
          previous.map((item) =>
            item._id === lesson._id
              ? {
                  ...item,
                  completed: true,
                  completedAt:
                    new Date().toISOString(),
                }
              : item
          )
        );
      }

      /*
       * Refresh server components so
       * progress and statistics update.
       */
      router.refresh();
    } catch (error) {
      console.error(
        "Complete lesson error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete lesson."
      );
    } finally {
      setCompletingLessonId(null);
    }
  }

  /*
   * --------------------------------------------------
   * Delete Lesson
   * --------------------------------------------------
   */

  async function handleDeleteLesson(
    lessonId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setDeletingLessonId(lessonId);

      const response = await fetch(
        `${API_URL}/topics/${encodeURIComponent(
          topicId
        )}/lessons/${encodeURIComponent(
          lessonId
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result =
        await response
          .json()
          .catch(() => ({
            success: false,
          }));

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to delete lesson."
        );
      }

      /*
       * Remove lesson immediately from
       * local state.
       */
      setLessons((previous) =>
        previous.filter(
          (lesson) =>
            lesson._id !== lessonId
        )
      );

      /*
       * Refresh server components so
       * lesson counts and progress update.
       */
      router.refresh();
    } catch (error) {
      console.error(
        "Delete lesson error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete lesson."
      );
    } finally {
      setDeletingLessonId(null);
    }
  }

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <>
      {/* =====================================================
          LESSONS SECTION
      ===================================================== */}

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Learning content
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Lessons
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete lessons to update your
              topic progress.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow"
          >
            + Add Lesson
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !showAddModal && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* =================================================
            LESSON LIST
        ================================================= */}

        <div className="mt-6 space-y-3">
          {lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                📚
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-800">
                No lessons yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Add your first lesson to start
                tracking progress for this topic.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                + Add your first lesson
              </button>
            </div>
          ) : (
            lessons.map((lesson, index) => {
              const isCompleting =
                completingLessonId ===
                lesson._id;

              const isDeleting =
                deletingLessonId ===
                lesson._id;

              return (
                <article
                  key={lesson._id}
                  className={`rounded-2xl border p-4 transition ${
                    lesson.completed
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-200 bg-white hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* =================================================
                        COMPLETION BUTTON
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        completeLesson(lesson)
                      }
                      disabled={
                        lesson.completed ||
                        isCompleting
                      }
                      aria-label={
                        lesson.completed
                          ? "Lesson completed"
                          : "Mark lesson complete"
                      }
                      aria-pressed={
                        lesson.completed
                      }
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                        lesson.completed
                          ? "cursor-not-allowed border-emerald-500 bg-emerald-500 text-white"
                          : isCompleting
                          ? "cursor-wait border-indigo-400 bg-indigo-50 text-indigo-500"
                          : "border-slate-300 bg-white text-transparent hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
                    >
                      {isCompleting
                        ? "..."
                        : "✓"}
                    </button>

                    {/* =================================================
                        LESSON CONTENT
                    ================================================= */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span className="text-xs font-medium text-slate-400">
                            Lesson {index + 1}
                          </span>

                          <h3
                            className={`mt-0.5 text-sm font-bold ${
                              lesson.completed
                                ? "text-emerald-800 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {lesson.title}
                          </h3>
                        </div>

                        {/* Completed badge */}
                        {lesson.completed && (
                          <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                            Completed
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {lesson.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {lesson.description}
                        </p>
                      )}

                      {/* Content preview */}
                      {lesson.content && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {lesson.content}
                        </p>
                      )}

                      {/* Resource */}
                      {lesson.resourceUrl && (
                        <a
                          href={
                            lesson.resourceUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                          {lesson.resourceType ===
                          "pdf"
                            ? "📄 Open PDF"
                            : lesson.resourceType ===
                              "image"
                            ? "🖼 Open image"
                            : "🔗 Open resource"}
                        </a>
                      )}

                      {/* Bottom actions */}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        {/* Completion information */}
                        <div>
                          {lesson.completed ? (
                            <p className="text-xs font-medium text-emerald-600">
                              ✓ This lesson is
                              completed
                            </p>
                          ) : (
                            <p className="text-xs text-slate-400">
                              Click the circle to
                              complete this lesson.
                            </p>
                          )}
                        </div>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteLesson(
                              lesson._id
                            )
                          }
                          disabled={isDeleting}
                          className="text-xs font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        {lessons.length > 0 && (
          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <p className="text-xs leading-5 text-indigo-700">
              <span className="font-semibold">
                Progress tracking:
              </span>{" "}
              Once a lesson is completed, it
              cannot be reopened. Your topic
              progress is updated automatically.
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          ADD LESSON MODAL
      ===================================================== */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddModal();
            }
          }}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-lesson-title"
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Lesson
                </p>

                <h2
                  id="add-lesson-title"
                  className="mt-1 text-lg font-bold text-slate-900"
                >
                  Add New Lesson
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add learning content to this
                  topic.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* =================================================
                MODAL FORM
            ================================================= */}

            <form
              onSubmit={handleAddLesson}
            >
              <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  {/* =================================================
                      TITLE
                  ================================================= */}

                  <div>
                    <label
                      htmlFor="lesson-title"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Lesson title
                    </label>

                    <input
                      id="lesson-title"
                      type="text"
                      value={form.title}
                      onChange={(event) =>
                        updateForm(
                          "title",
                          event.target.value
                        )
                      }
                      placeholder="e.g. Introduction to React Hooks"
                      maxLength={150}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      required
                    />

                    <div className="mt-1 text-right text-[11px] text-slate-400">
                      {form.title.length}/150
                    </div>
                  </div>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <div>
                    <label
                      htmlFor="lesson-description"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Description
                    </label>

                    <textarea
                      id="lesson-description"
                      value={
                        form.description
                      }
                      onChange={(event) =>
                        updateForm(
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="Briefly describe what this lesson covers..."
                      rows={3}
                      maxLength={500}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <div className="mt-1 text-right text-[11px] text-slate-400">
                      {
                        form.description
                          .length
                      }
                      /500
                    </div>
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div>
                    <label
                      htmlFor="lesson-content"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Lesson content
                    </label>

                    <textarea
                      id="lesson-content"
                      value={form.content}
                      onChange={(event) =>
                        updateForm(
                          "content",
                          event.target.value
                        )
                      }
                      placeholder="Write your lesson content, notes, examples, etc..."
                      rows={6}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* =================================================
                      RESOURCE
                  ================================================= */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Resource Type */}

                    <div>
                      <label
                        htmlFor="resource-type"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Resource type
                      </label>

                      <select
                        id="resource-type"
                        value={
                          form.resourceType
                        }
                        onChange={(event) =>
                          updateForm(
                            "resourceType",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="none">
                          None
                        </option>

                        <option value="external">
                          External link
                        </option>

                        <option value="pdf">
                          PDF
                        </option>

                        <option value="image">
                          Image
                        </option>
                      </select>
                    </div>

                    {/* Resource URL */}

                    <div>
                      <label
                        htmlFor="resource-url"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Resource URL
                      </label>

                      <input
                        id="resource-url"
                        type="url"
                        value={
                          form.resourceUrl
                        }
                        onChange={(event) =>
                          updateForm(
                            "resourceUrl",
                            event.target.value
                          )
                        }
                        placeholder="https://example.com/resource"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Adding Lesson..."
                    : "Add Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}