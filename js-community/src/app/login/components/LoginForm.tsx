"use client";

/**
 * Login form component with rate limiting and security features
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateEmail } from "@/lib/validation";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface FormData {
  identifier: string; // email or username
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

interface RateLimitInfo {
  attempts: number;
  blockedUntil: number | null;
}

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Rate limiting state (client-side)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>(() => {
    if (typeof window === "undefined")
      return { attempts: 0, blockedUntil: null };

    const stored = localStorage.getItem("loginRateLimit");
    if (!stored) return { attempts: 0, blockedUntil: null };

    const parsed = JSON.parse(stored);
    // Clear if block duration has passed
    if (parsed.blockedUntil && Date.now() > parsed.blockedUntil) {
      localStorage.removeItem("loginRateLimit");
      return { attempts: 0, blockedUntil: null };
    }
    return parsed;
  });

  const isBlocked = Boolean(
    rateLimitInfo.blockedUntil && Date.now() < rateLimitInfo.blockedUntil,
  );
  const remainingTime =
    isBlocked && rateLimitInfo.blockedUntil
      ? Math.ceil((rateLimitInfo.blockedUntil - Date.now()) / 1000 / 60)
      : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate identifier (email or username)
    if (!formData.identifier) {
      newErrors.identifier = "Email or username is required";
    } else if (formData.identifier.includes("@")) {
      const emailValidation = validateEmail(formData.identifier);
      if (!emailValidation.valid) {
        newErrors.identifier = emailValidation.error;
      }
    } else if (formData.identifier.length < 3) {
      newErrors.identifier = "Username must be at least 3 characters";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateRateLimit = (failed: boolean) => {
    if (!failed) {
      // Successful login - reset rate limit
      localStorage.removeItem("loginRateLimit");
      setRateLimitInfo({ attempts: 0, blockedUntil: null });
      return;
    }

    const newAttempts = rateLimitInfo.attempts + 1;
    const newRateLimit: RateLimitInfo = {
      attempts: newAttempts,
      blockedUntil:
        newAttempts >= MAX_ATTEMPTS ? Date.now() + BLOCK_DURATION : null,
    };

    localStorage.setItem("loginRateLimit", JSON.stringify(newRateLimit));
    setRateLimitInfo(newRateLimit);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check rate limiting
    if (isBlocked) {
      setErrors({
        general: `Too many failed login attempts. Please try again in ${remainingTime} minutes.`,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.identifier,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        updateRateLimit(true);
        setErrors({
          general: data.error || "Invalid email/username or password",
        });
        return;
      }

      // Successful login
      updateRateLimit(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      updateRateLimit(true);
      setErrors({
        general: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {errors.general}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-gray-700"
        >
          Email or Username
        </label>
        <div className="mt-1">
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            value={formData.identifier}
            onChange={handleInputChange}
            disabled={isBlocked}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your email or username"
          />
          {errors.identifier && (
            <p className="mt-2 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isBlocked}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            disabled={isBlocked}
          >
            {showPassword ? (
              <span className="text-gray-500">Hide</span>
            ) : (
              <span className="text-gray-500">Show</span>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password}</p>
        )}
        {formData.password && (
          <PasswordStrengthIndicator password={formData.password} />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={isBlocked}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || isBlocked}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Signing in..."
            : isBlocked
              ? `Blocked (${remainingTime}m)`
              : "Sign in"}
        </button>
      </div>

      {rateLimitInfo.attempts > 0 && rateLimitInfo.attempts < MAX_ATTEMPTS && (
        <p className="text-sm text-amber-600 text-center">
          {MAX_ATTEMPTS - rateLimitInfo.attempts} login attempts remaining
        </p>
      )}
    </form>
  );
}
