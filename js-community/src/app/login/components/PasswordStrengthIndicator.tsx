"use client";

/**
 * Password strength indicator component
 */

import { validatePassword } from "@/lib/validation";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const validation = validatePassword(password);
  const strength = validation.strength || "weak";

  const getStrengthColor = () => {
    switch (strength) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case "strong":
        return "w-full";
      case "medium":
        return "w-2/3";
      default:
        return "w-1/3";
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case "strong":
        return "Strong password";
      case "medium":
        return "Medium strength";
      default:
        return "Weak password";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
          />
        </div>
        <span
          className={`text-xs font-medium ${
            strength === "strong"
              ? "text-green-600"
              : strength === "medium"
                ? "text-yellow-600"
                : "text-red-600"
          }`}
        >
          {getStrengthLabel()}
        </span>
      </div>
      {!validation.valid && validation.error && (
        <p className="mt-1 text-xs text-gray-500">{validation.error}</p>
      )}
    </div>
  );
}
