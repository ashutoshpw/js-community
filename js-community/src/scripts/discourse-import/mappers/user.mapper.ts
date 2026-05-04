/**
 * Discourse Import — User mapper
 *
 * Transforms a Discourse user export row into the shape expected by
 * the JS Community `users` and `user_profiles` tables.
 */

import type { NewUser, NewUserProfile } from "@/db/schema";

/** Discourse user export shape (subset of fields we care about) */
export interface DiscourseUser {
  id: number;
  username: string;
  name?: string | null;
  email: string;
  admin?: boolean;
  moderator?: boolean;
  trust_level?: number;
  active?: boolean;
  approved?: boolean;
  suspended?: boolean;
  silenced?: boolean;
  suspended_at?: string | null;
  suspended_till?: string | null;
  silenced_till?: string | null;
  last_seen_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // Profile fields (sometimes inlined in the export)
  location?: string | null;
  website?: string | null;
  bio_raw?: string | null;
  bio_cooked?: string | null;
  avatar_url?: string | null;
}

export interface MappedUser {
  user: NewUser;
  profile: Omit<NewUserProfile, "userId">;
}

export function mapUser(d: DiscourseUser): MappedUser {
  const now = new Date();
  return {
    user: {
      username: d.username,
      name: d.name ?? null,
      email: d.email,
      admin: d.admin ?? false,
      moderator: d.moderator ?? false,
      trustLevel: d.trust_level ?? 0,
      active: d.active ?? true,
      approved: d.approved ?? false,
      suspended: d.suspended ?? false,
      silenced: d.silenced ?? false,
      suspendedAt: d.suspended_at ? new Date(d.suspended_at) : null,
      suspendedTill: d.suspended_till ? new Date(d.suspended_till) : null,
      silencedTill: d.silenced_till ? new Date(d.silenced_till) : null,
      lastSeenAt: d.last_seen_at ? new Date(d.last_seen_at) : null,
      createdAt: d.created_at ? new Date(d.created_at) : now,
      updatedAt: d.updated_at ? new Date(d.updated_at) : now,
    },
    profile: {
      location: d.location ?? null,
      website: d.website ?? null,
      bioRaw: d.bio_raw ?? null,
      bioCooked: d.bio_cooked ?? null,
      avatarUrl: d.avatar_url ?? null,
      profileBackgroundUrl: null,
      cardBackgroundUrl: null,
      views: 0,
      createdAt: d.created_at ? new Date(d.created_at) : now,
      updatedAt: d.updated_at ? new Date(d.updated_at) : now,
    },
  };
}
