"use client";

/**
 * Reset password form component
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordStrengthIndicator from "@/app/login/components/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/validation";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    try {
      const response = await fetch("/api/password-reset/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.error || "Failed to reset password",
        });
        return;
      }

      // Redirect to login page with success message
      router.push("/login?reset=success");
    } catch (error) {
      console.error("Reset password error:", error);
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

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your new password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            disabled={isLoading}
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <div className="mt-1 relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <span className="text-gray-500">Hide</span>
            ) : (
              <span className="text-gray-500">Show</span>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
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
