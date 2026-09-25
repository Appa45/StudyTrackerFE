"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthShell from "../../components/auth/AuthShell";
import FormInput from "../../components/ui/FormInput";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

interface RegisterResponse {
  success?: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      general: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!form.acceptTerms) {
      nextErrors.terms =
        "Please accept the terms to continue.";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data: RegisterResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        const message =
          data.message ||
          data.error ||
          "Unable to create your account.";

        // Show duplicate email errors near the email field.
        if (response.status === 409) {
          setErrors({
            email: message,
          });
        } else {
          setErrors({
            general: message,
          });
        }

        return;
      }

      // Registration successful.
      setErrors({});

      // Redirect user to login page.
      router.push(
        `/login?registered=true&email=${encodeURIComponent(
          form.email.trim()
        )}`
      );
    } catch (error) {
      console.error("Registration error:", error);

      setErrors({
        general:
          "Unable to connect to the server. Please make sure the backend is running.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start organizing your learning journey today."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkHref="/login"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* General API error */}
        {errors.general && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errors.general}
          </div>
        )}

        {/* Full name */}
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          autoComplete="name"
          value={form.name}
          onChange={(event) =>
            handleChange("name", event.target.value)
          }
          error={errors.name}
        />

        {/* Email */}
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            handleChange("email", event.target.value)
          }
          error={errors.email}
        />

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                handleChange(
                  "password",
                  event.target.value
                )
              }
              className={`w-full rounded-xl border bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs font-medium text-red-600">
              {errors.password}
            </p>
          )}

          <p className="text-xs text-slate-400">
            Use at least 8 characters.
          </p>
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) =>
                handleChange(
                  "confirmPassword",
                  event.target.value
                )
              }
              className={`w-full rounded-xl border bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(event) =>
                handleChange(
                  "acceptTerms",
                  event.target.checked
                )
              }
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span className="text-sm leading-5 text-slate-600">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {errors.terms && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {errors.terms}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Creating account..."
            : "Create account"}
        </button>

        {/* Google */}
        <div className="flex items-center gap-4 py-1">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-400">
            or
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span className="font-bold">G</span>
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
}