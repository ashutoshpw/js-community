import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import { FeatureHero } from "./components/FeatureHero";
import { FeatureDetail } from "./components/FeatureDetail";
import { ComparisonTable } from "./components/ComparisonTable";
import { FeatureCTA } from "./components/FeatureCTA";

export const metadata: Metadata = {
  title: "Features | JS Community",
  description:
    "Explore all the features of JS Community — threaded discussions, real-time updates, full-text search, trust levels, moderation tools, private messaging, and more.",
  keywords: [
    "features",
    "JavaScript community",
    "forum",
    "discussions",
    "real-time",
    "moderation",
    "search",
    "trust levels",
  ],
  openGraph: {
    title: "Features | JS Community",
    description:
      "Explore all the features of JS Community — threaded discussions, real-time updates, full-text search, trust levels, moderation tools, private messaging, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features | JS Community",
    description:
      "Explore all the features of JS Community — threaded discussions, real-time updates, full-text search, trust levels, moderation tools, private messaging, and more.",
  },
};

const FEATURES = [
  {
    icon: "💬",
    title: "Rich Threaded Discussions",
    description:
      "Every conversation is a first-class topic with full Markdown support, nested replies, post revisions, and version history. Authors can edit posts with a full revision trail, and readers can quote specific passages in their replies.",
    bullets: [
      "CommonMark Markdown rendered via marked.js — headings, bold, italic, code blocks, tables, lists",
      "Code blocks with syntax highlighting for dozens of languages",
      "Reply-to-post threading so conversations stay organized",
      "Post revisions tracked with version number and timestamps",
      "HTML sanitized via DOMPurify before display — no XSS",
      "Topics can be pinned globally, closed, or archived by moderators",
    ],
  },
  {
    icon: "⚡",
    title: "Real-time Updates",
    description:
      "New replies, typing indicators, and presence information are pushed to the browser via Server-Sent Events — no polling, no stale feeds. When someone posts while you're reading a topic, a prompt appears to load new content without a full page reload.",
    bullets: [
      "Server-Sent Events (SSE) over a persistent HTTP connection",
      "Channel-based subscriptions: global feed, per-topic, per-user",
      "Typing indicators show when someone is composing a reply",
      "Presence tracking shows who is currently reading a topic",
      "Graceful degradation — full functionality without real-time enabled",
      "Feature-flagged via NEXT_PUBLIC_ENABLE_REALTIME for controlled rollout",
    ],
  },
  {
    icon: "🔍",
    title: "Powerful Full-text Search",
    description:
      "Search is powered by PostgreSQL's built-in full-text search engine — no external search service required. Results cover both topic titles and post bodies, with filters for type, category, and author.",
    bullets: [
      "to_tsvector / to_tsquery for ranked, stemmed full-text search",
      "ilike fallback for partial-match queries",
      "Filter results by content type: topics, posts, or all",
      "Filter by category or author username",
      "Minimum 2-character query enforced to prevent runaway scans",
      "Paginated results with hasMore indicator",
    ],
  },
  {
    icon: "🏅",
    title: "Trust Level System",
    description:
      "JS Community implements a Discourse-inspired 5-tier trust level system that automatically promotes users as they participate. Permissions expand at each level — protecting the community from spam while rewarding genuine contributors.",
    bullets: [
      "Level 0 (New User) — can read, post topics, and reply with daily message limits",
      "Level 1 (Basic) — unlocked after 1 day, 5 topics, 30 posts read, 1 like given",
      "Level 2 (Member) — unlocked after 15 days, 20 topics, 100 posts read",
      "Level 3 (Regular) — unlocked after 50 days and 50 posts created",
      "Level 4 (Leader) — manually granted; moderation-lite capabilities",
      "Promotions run as a background job via Inngest — no manual cron needed",
    ],
  },
  {
    icon: "🛡️",
    title: "Smart Moderation",
    description:
      "Moderators and admins have a full toolbox: flag queues, content review, user management, and a live admin dashboard. The review queue surface flags from users and handles them in one place.",
    bullets: [
      "11 post action types: spam, off-topic, inappropriate, like, flag, and more",
      "Review queue at /admin/review — approve or dismiss flagged content",
      "User suspend, silence, and permanent ban with audit log",
      "Admin dashboard with live metrics: users, topics, posts — today vs yesterday trends",
      "Category management with slug, description, and color",
      "Site-wide settings stored in the database and editable by admins",
    ],
  },
  {
    icon: "✉️",
    title: "Private Messaging",
    description:
      "Members can send private messages directly to other users. Conversation threads support full Markdown, multiple replies, and show unread counts in the header notification badge.",
    bullets: [
      "Start a conversation at /forum/messages/new",
      "Recipient lookup by username with search",
      "Full Markdown composition with the same editor as public posts",
      "Conversation thread view at /forum/messages/[id]",
      "Unread message count shown in the header",
      "Notifications triggered on new private message receipt",
    ],
  },
  {
    icon: "🔖",
    title: "Bookmarks & Activity Feeds",
    description:
      "Save any post or topic with one click and access your personal reading list at any time. Activity feeds let you track a specific user's contributions — useful for following community experts.",
    bullets: [
      "Bookmark any post from the action bar — saved to your profile",
      "Bookmark list at /forum/u/[username]/bookmarks",
      "Activity feed at /forum/u/[username]/activity showing posts and topics",
      "User profile with join date, trust level, post count, and bio",
      "Avatar upload with automatic Vercel Blob storage",
      "All data private per user — bookmarks not visible to others",
    ],
  },
  {
    icon: "📁",
    title: "File & Image Uploads",
    description:
      "Attach images to any post using the Markdown image syntax. Files are stored on Vercel Blob — globally distributed, CDN-backed, and instantly available via a signed URL embedded in your post.",
    bullets: [
      "Upload endpoint at /api/forum/uploads — authentication required",
      "Supported formats: JPEG, PNG, GIF, WebP",
      "Maximum file size: 5 MB per image",
      "Files stored on Vercel Blob with a public CDN URL",
      "Returned URL can be embedded with standard Markdown: ![alt](url)",
      "Upload restricted to authenticated users to prevent abuse",
    ],
  },
  {
    icon: "🔔",
    title: "Notifications",
    description:
      "JS Community tracks 11 distinct notification types and surfaces them in a real-time badge in the header. Preferences let each user decide which events matter to them.",
    bullets: [
      "Types: mention, replied, quoted, liked, posted, private message, badge earned, trust level change, and more",
      "Unread count badge in the forum header",
      "Mark individual or all notifications as read",
      "Notification preferences API at /api/forum/notifications/preferences",
      "Notification rows stored in PostgreSQL — no external service needed",
      "Real-time delivery when SSE is enabled",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <FeatureHero />
      {FEATURES.map((feature, index) => (
        <FeatureDetail
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          bullets={feature.bullets}
          reversed={index % 2 !== 0}
          index={index}
        />
      ))}
      <ComparisonTable />
      <FeatureCTA />
      <Footer />
    </div>
  );
}
