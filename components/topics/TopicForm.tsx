"use client";

import { FormEvent, useState } from "react";

export type TopicFormValues = {
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  progress: number;
  targetDate: string;
  status: "Not Started" | "In Progress" | "Completed";
};

interface TopicFormProps {
  initialValues?: Partial<TopicFormValues>;
  mode?: "create" | "edit";
  topicId?: string;
  onSubmit?: (
    values: TopicFormValues
  ) => Promise<void> | void;
  onCancel?: () => void;
}

interface FormErrors {
  title?: string;
  subject?: string;
  description?: string;
  progress?: string;
  targetDate?: string;
}

const defaultValues: TopicFormValues = {
  title: "",
  subject: "",
  difficulty: "Beginner",
  description: "",
  progress: 0,
  targetDate: "",
  status: "Not Started",
};

export default function TopicForm({
  initialValues,
  mode = "create",
  onSubmit,
  onCancel,
}: TopicFormProps) {
  const [form, setForm] = useState<TopicFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSaving, setIsSaving] =
    useState(false);

  function updateField<K extends keyof TopicFormValues>(
    field: K,
    value: TopicFormValues[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title =
        "Topic name is required.";
    } else if (form.title.trim().length < 3) {
      nextErrors.title =
        "Topic name must contain at least 3 characters.";
    } else if (form.title.trim().length > 100) {
      nextErrors.title =
        "Topic name cannot exceed 100 characters.";
    }

    if (!form.subject) {
      nextErrors.subject =
        "Please select a subject.";
    }

    if (form.description.length > 500) {
      nextErrors.description =
        "Description cannot exceed 500 characters.";
    }

    if (
      form.progress < 0 ||
      form.progress > 100
    ) {
      nextErrors.progress =
        "Progress must be between 0 and 100.";
    }

    if (!form.targetDate) {
      nextErrors.targetDate =
        "Target date is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    try {
      const cleanedValues: TopicFormValues = {
        ...form,
        title: form.title.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        progress: Math.min(
          100,
          Math.max(0, Number(form.progress))
        ),
      };

      await onSubmit?.(cleanedValues);
    } catch (error) {
      console.error(
        "Topic form submission failed:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {/* Topic name */}
      <div>
        <label
          htmlFor="topic-title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Topic name
        </label>

        <input
          id="topic-title"
          name="title"
          type="text"
          placeholder="e.g. React Hooks"
          value={form.title}
          onChange={(event) =>
            updateField(
              "title",
              event.target.value
            )
          }
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
            errors.title
              ? "border-red-400"
              : "border-slate-200"
          }`}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Subject + Difficulty */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Subject */}
        <div>
          <label
            htmlFor="topic-subject"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Subject
          </label>

          <select
            id="topic-subject"
            value={form.subject}
            onChange={(event) =>
              updateField(
                "subject",
                event.target.value
              )
            }
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
              errors.subject
                ? "border-red-400"
                : "border-slate-200"
            }`}
          >
            <option value="">
              Select subject
            </option>

            <option value="Frontend">
              Frontend
            </option>

            <option value="JavaScript">
              JavaScript
            </option>

            <option value="Backend">
              Backend
            </option>

            <option value="Database">
              Database
            </option>
          </select>

          {errors.subject && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label
            htmlFor="topic-difficulty"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Difficulty
          </label>

          <select
            id="topic-difficulty"
            value={form.difficulty}
            onChange={(event) =>
              updateField(
                "difficulty",
                event.target
                  .value as TopicFormValues["difficulty"]
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
      </div>

      {/* Description */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="topic-description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <span className="text-[11px] text-slate-400">
            {form.description.length}/500
          </span>
        </div>

        <textarea
          id="topic-description"
          name="description"
          rows={4}
          maxLength={500}
          placeholder="What do you want to learn?"
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
            errors.description
              ? "border-red-400"
              : "border-slate-200"
          }`}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Target date */}
      <div>
        <label
          htmlFor="topic-target-date"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Target date
        </label>

        <input
          id="topic-target-date"
          type="date"
          value={form.targetDate}
          onChange={(event) =>
            updateField(
              "targetDate",
              event.target.value
            )
          }
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
            errors.targetDate
              ? "border-red-400"
              : "border-slate-200"
          }`}
        />

        {errors.targetDate && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.targetDate}
          </p>
        )}
      </div>

      {/* Edit-only fields */}
      {mode === "edit" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="topic-progress"
                className="text-sm font-medium text-slate-700"
              >
                Progress
              </label>

              <span className="text-xs font-semibold text-indigo-600">
                {form.progress}%
              </span>
            </div>

            <input
              id="topic-progress"
              type="range"
              min="0"
              max="100"
              value={form.progress}
              onChange={(event) =>
                updateField(
                  "progress",
                  Number(event.target.value)
                )
              }
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="topic-status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="topic-status"
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target
                    .value as TopicFormValues["status"]
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Saving..."
            : mode === "edit"
              ? "Save changes"
              : "Create topic"}
        </button>
      </div>
    </form>
  );
}