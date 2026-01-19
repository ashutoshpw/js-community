/**
 * Reset password page
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | JS Community",
  description: "Create a new password for your account",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token;

  // Redirect to forgot password if no token
  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter a new password for your account
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
