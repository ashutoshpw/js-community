"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQCategory } from "./FAQCategory";

const FAQ_DATA = [
  {
    title: "Getting Started",
    icon: "🚀",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Visit /register and fill in your username, email address, and password (minimum 8 characters, maximum 128). You can also sign in with your Google or GitHub account for faster setup. Once registered you start at Trust Level 0 (New User) and gain access to more features as you participate.",
      },
      {
        question: "What can I do as a new user (Trust Level 0)?",
        answer:
          "New users can read all public topics, create new topics, reply to existing ones, and send up to 10 direct messages per day. Some actions — such as liking many posts in a row or posting external links — have rate limits that ease automatically as you become more active.",
      },
      {
        question: "How do I create my first topic?",
        answer:
          "Navigate to /forum/new after logging in. Choose a category, write a descriptive title, compose your post using Markdown, optionally add tags, then click Post. Your topic appears immediately in the Latest feed.",
      },
      {
        question: "Can I sign in with Google or GitHub?",
        answer:
          "Yes. On the login page click 'Continue with Google' or 'Continue with GitHub'. You will be redirected to the OAuth provider and returned to the forum once authorized. Your account is linked to your email address, so if you later sign in with a different provider sharing the same email it resolves to the same account.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot your password?' on the /login page and enter your email. You will receive a reset link valid for one hour. The link is single-use — if you request another reset before using the first link, a new link is issued and the old one is invalidated. Password reset emails are delivered via Resend.",
      },
    ],
  },
  {
    title: "Features",
    icon: "✨",
    items: [
      {
        question: "What Markdown formatting is supported?",
        answer:
          "Posts and topics support the full CommonMark Markdown spec, rendered via marked.js. This includes headings (#, ##, ###), bold (**text**), italic (*text*), inline code (`code`), fenced code blocks with syntax highlighting (```language), links ([label](url)), images (![alt](url)), ordered and unordered lists, blockquotes (>), and horizontal rules (---). HTML in posts is sanitized via DOMPurify before display.",
      },
      {
        question: "How does search work?",
        answer:
          "Search at /forum/search uses PostgreSQL full-text search (to_tsvector / to_tsquery) with an ilike fallback for partial matches. You can filter by type (topics, posts, or all), category, and author. The query must be at least 2 characters long. Results are ranked by recency and support pagination.",
      },
      {
        question: "What are notifications and how do I manage them?",
        answer:
          "You receive notifications for mentions, replies to your posts, quotes, likes, private messages, badge awards, trust level changes, and watched topics. Unread counts appear in the header. Mark all as read via the notification panel. Adjust which events trigger notifications in your preferences under /forum/u/[username]/preferences.",
      },
      {
        question: "How do bookmarks work?",
        answer:
          "Click the bookmark icon on any post to save it. Your bookmarks are accessible at /forum/u/[username]/bookmarks. You can bookmark both topic-opening posts and replies. Bookmarks are private to your account.",
      },
      {
        question: "How does private messaging work?",
        answer:
          "Start a new message at /forum/messages/new, search for the recipient's username, compose your message with Markdown, and send. Conversation threads appear at /forum/messages. Each conversation supports multiple replies and is fully private between participants.",
      },
      {
        question: "What types of files can I upload?",
        answer:
          "The image upload endpoint at /api/forum/uploads accepts JPEG, PNG, GIF, and WebP files up to 5 MB each. Files are stored on Vercel Blob and a URL is returned to embed in your post using standard Markdown image syntax.",
      },
      {
        question: "Are updates to topics shown in real time?",
        answer:
          "Real-time updates via Server-Sent Events (SSE) are available when the NEXT_PUBLIC_ENABLE_REALTIME environment variable is set to 'true' on the deployment. When enabled, new posts in an open topic, typing indicators, and presence updates are pushed to connected clients without a page refresh.",
      },
    ],
  },
  {
    title: "Account",
    icon: "👤",
    items: [
      {
        question: "How do I update my profile?",
        answer:
          "Go to /forum/u/[username]/edit (or click Edit Profile from your profile page). You can update your display name, bio, location, and website URL. Changes save immediately.",
      },
      {
        question: "How do I upload a profile avatar?",
        answer:
          "On the profile edit page click 'Upload Avatar'. Supported formats are JPEG, PNG, GIF, and WebP up to 5 MB. The image is stored on Vercel Blob. After upload the new avatar appears across the forum immediately.",
      },
      {
        question: "Can I change my username?",
        answer:
          "Username changes are supported from the profile settings page. Usernames must be unique across the platform. Existing links to your profile (e.g., /forum/u/oldname) will not automatically redirect — update your bio links if needed.",
      },
      {
        question: "How is my password stored?",
        answer:
          "Passwords are hashed using bcrypt (via better-auth) before being stored in the database. Plain-text passwords are never persisted or logged. OAuth sign-ins (Google, GitHub) do not store passwords at all.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Account deletion requests can be submitted via your account settings. Because your posts are associated with your user record, deletion may anonymize or soft-delete authored content in line with the Privacy Policy. Contact the team via /contact if you need assistance.",
      },
    ],
  },
  {
    title: "Moderation & Trust",
    icon: "🛡️",
    items: [
      {
        question: "What are trust levels and how do I advance?",
        answer:
          "Trust levels (0–4) gate progressively more permissions. Level 0 (New User) is the default. Level 1 (Basic) requires 1 day visited, 5 topics entered, 30 posts read, and 1 like given. Level 2 (Member) requires 15 days, 20 topics, 100 posts read, 1 like received, and 10 posts created. Level 3 (Regular) requires 50 days, 100 topics, 500 posts read, and 50 posts created. Level 4 (Leader) is granted manually by admins. Promotions run automatically in the background.",
      },
      {
        question: "How do I report a post?",
        answer:
          "Click the flag (⚑) icon on any post to report it. Select the reason (spam, off-topic, inappropriate, or other) and optionally add a note. The flag is submitted to the moderator review queue at /admin/review, where staff can take action.",
      },
      {
        question: "What happens when I get flagged?",
        answer:
          "If multiple users flag your post it may be automatically hidden pending review. A moderator will review the flag and either restore the post, edit it, or take further action. You will receive a notification about the outcome.",
      },
      {
        question: "Can I be suspended or banned?",
        answer:
          "Admins can suspend an account temporarily or ban it permanently for violations of the Community Guidelines. Suspended users cannot post or reply for the duration of the suspension. Banned users cannot log in. You will receive an email notification if your account is actioned.",
      },
      {
        question: "Who are moderators and admins?",
        answer:
          "Moderators can manage flags, hide posts, and review the content queue. Admins have full access including user management, category configuration, site settings, and analytics. Trust Level 4 (Leader) members gain moderation-lite capabilities such as recategorising and renaming topics.",
      },
    ],
  },
  {
    title: "Technical",
    icon: "⚙️",
    items: [
      {
        question: "What browsers are supported?",
        answer:
          "JS Community runs on any modern browser — Chrome, Firefox, Safari, and Edge at their current and previous major versions. The forum is fully responsive and works well on mobile browsers. JavaScript is required.",
      },
      {
        question: "Is there a mobile app?",
        answer:
          "There is no dedicated native app at this time. The web app is mobile-first and responsive, providing a full forum experience from any smartphone browser.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "All user data is stored in a PostgreSQL database. Uploaded files (avatars, images) are stored on Vercel Blob. Sessions are managed by better-auth with secure, signed cookies. See the Privacy Policy at /privacy for full details.",
      },
      {
        question: "Does JS Community have an API?",
        answer:
          "Yes. The platform exposes REST API endpoints under /api for topics, posts, users, categories, search, notifications, private messages, bookmarks, and admin operations. Authenticated endpoints require a valid session cookie. See the API Reference in the documentation at /docs/api-reference.",
      },
      {
        question: "How is email delivery handled?",
        answer:
          "Transactional emails (password resets, notifications) are delivered via Resend. Email jobs are processed by Inngest for reliable, retried delivery. If you do not receive a password reset email, check your spam folder or contact support via /contact.",
      },
    ],
  },
];

export function FAQClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const hasResults = FAQ_DATA.some((category) =>
    category.items.some(
      (item) =>
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div>
      {/* Search */}
      <div className="mb-10">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions…"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          aria-label="Search frequently asked questions"
        />
      </div>

      {/* Categories */}
      {hasResults ? (
        FAQ_DATA.map((category) => (
          <FAQCategory
            key={category.title}
            title={category.title}
            icon={category.icon}
            items={category.items}
            searchQuery={searchQuery}
          />
        ))
      ) : (
        <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-lg font-medium">No results for "{searchQuery}"</p>
          <p className="mt-1 text-sm">
            Try a different keyword or browse the categories below.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          Still have questions?
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Our team is happy to help.
        </p>
        <a
          href="/contact#contact-form"
          className="mt-4 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
