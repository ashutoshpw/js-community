"use client";

/**
 * Forgot password form component
 */

import { useState } from "react";
import { validateEmail } from "@/lib/validation";

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user types
    if (errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setErrors({
            general: data.error || "Too many requests. Please try again later.",
          });
        } else {
          setErrors({
            general: data.error || "An error occurred. Please try again.",
          });
        }
        return;
      }

      // Show success message
      setSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors({
        general: "An error occurred. Please try again.",
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

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                If an account exists with this email, a password reset link has
                been sent.
              </h3>
              <p className="mt-2 text-sm text-green-700">
                Please check your email for further instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            value={email}
            onChange={handleInputChange}
            disabled={isLoading}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>

      <div className="text-center text-sm">
        <a
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Back to Sign In
        </a>
      </div>
    </form>
  );
}
