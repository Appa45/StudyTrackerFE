"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";

import AuthShell from "../../components/auth/AuthShell";
import FormInput from "../../components/ui/FormInput";

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginResponse {
  success?: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function validateForm() {
    const nextErrors: LoginErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  // Email and password login
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
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          rememberMe: form.rememberMe,
        }),
      });

      const data: LoginResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || data.success === false) {
        setErrors({
          general:
            data.message ||
            data.error ||
            "Invalid email or password.",
        });
        return;
      }

      // Backend sets the JWT in an httpOnly cookie.
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        general:
          "Unable to connect to the server. Please make sure the backend is running.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Google login
  async function handleGoogleSuccess(
    googleResponse: CredentialResponse
  ) {
    const credential = googleResponse.credential;

    if (!credential) {
      setErrors({
        general: "Google did not return a login credential.",
      });
      return;
    }

    setIsGoogleLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credential,
        }),
      });

      const data: LoginResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || data.success === false) {
        setErrors({
          general:
            data.message ||
            data.error ||
            "Google login failed. Please try again.",
        });
        return;
      }

      // The backend must verify the Google credential
      // and set the StudyTrack authentication cookie.
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Google login error:", error);

      setErrors({
        general:
          "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  function handleGoogleError() {
    setErrors({
      general:
        "Google sign-in failed or was cancelled. Please try again.",
    });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login and continue your learning journey."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
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

        {/* Email */}
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(event) => {
            setForm((previous) => ({
              ...previous,
              email: event.target.value,
            }));

            setErrors((previous) => ({
              ...previous,
              email: undefined,
              general: undefined,
            }));
          }}
          error={errors.email}
        />

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => {
                setForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }));

                setErrors((previous) => ({
                  ...previous,
                  password: undefined,
                  general: undefined,
                }));
              }}
              className={`w-full rounded-2xl bg-white px-4 py-3.5 pr-16 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 ${
                errors.password
                  ? "ring-2 ring-red-200"
                  : "ring-1 ring-slate-200 focus:ring-indigo-100"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                rememberMe: event.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />

          <span className="text-sm text-slate-500">
            Remember me
          </span>
        </label>

        {/* Email login */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-400">or</span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google login */}
        <div className="flex min-h-10 flex-col items-center justify-center gap-2">
          {isGoogleLoading ? (
            <p
              className="text-sm text-slate-500"
              role="status"
            >
              Signing in with Google...
            </p>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="320"
            />
          )}
        </div>
      </form>
    </AuthShell>
  );
}