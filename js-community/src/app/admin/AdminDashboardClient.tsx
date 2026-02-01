/**
 * Admin Dashboard Client Component
 *
 * Displays site metrics and quick actions.
 */

"use client";

import {
  Activity,
  FileText,
  Flag,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardMetrics {
  users: {
    total: number;
    newToday: number;
    activeToday: number;
    trend: number;
  };
  topics: {
    total: number;
    newToday: number;
    trend: number;
  };
  posts: {
    total: number;
    newToday: number;
    trend: number;
  };
  flags: {
    pending: number;
    resolvedToday: number;
  };
  recentActions: Array<{
    id: number;
    action: string;
    user: string;
    target: string;
    createdAt: string;
  }>;
}

const defaultMetrics: DashboardMetrics = {
  users: { total: 0, newToday: 0, activeToday: 0, trend: 0 },
  topics: { total: 0, newToday: 0, trend: 0 },
  posts: { total: 0, newToday: 0, trend: 0 },
  flags: { pending: 0, resolvedToday: 0 },
  recentActions: [],
};

export function AdminDashboardClient() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const StatCard = ({
    title,
    value,
    subtitle,
    trend,
    icon: Icon,
    href,
  }: {
    title: string;
    value: number;
    subtitle?: string;
    trend?: number;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
  }) => {
    const content = (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {isLoading ? "-" : value.toLocaleString()}
            </p>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Icon className="h-8 w-8 text-gray-400" />
            {trend !== undefined && trend !== 0 && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  trend > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="block transition-opacity hover:opacity-80">
          {content}
        </Link>
      );
    }
    return content;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={metrics.users.total}
          subtitle={`${metrics.users.newToday} new today`}
          trend={metrics.users.trend}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          title="Topics"
          value={metrics.topics.total}
          subtitle={`${metrics.topics.newToday} new today`}
          trend={metrics.topics.trend}
          icon={FileText}
        />
        <StatCard
          title="Posts"
          value={metrics.posts.total}
          subtitle={`${metrics.posts.newToday} new today`}
          trend={metrics.posts.trend}
          icon={MessageSquare}
        />
        <StatCard
          title="Pending Flags"
          value={metrics.flags.pending}
          subtitle={`${metrics.flags.resolvedToday} resolved today`}
          icon={Flag}
          href="/admin/review"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/users?filter=new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Review New Users
              </span>
            </Link>
            <Link
              href="/admin/review"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Flag className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Review Flags
              </span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Manage Categories
              </span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Site Settings
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Admin Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Admin Actions
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded bg-gray-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : metrics.recentActions.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent admin actions
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.recentActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-zinc-800"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {action.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {action.user} on {action.target}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(action.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
