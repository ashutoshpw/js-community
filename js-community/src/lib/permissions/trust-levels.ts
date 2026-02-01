/**
 * Trust Levels and Permissions Utility
 *
 * Implements Discourse-like trust level system with configurable permissions.
 */

/**
 * Trust Level Definitions
 * Following Discourse's trust level system:
 * 0 - New User: Just created account
 * 1 - Basic: Meets basic participation requirements
 * 2 - Member: Active participant, can access more features
 * 3 - Regular: Long-time trusted member
 * 4 - Leader: Can act as moderator lite
 */
export const TRUST_LEVELS = {
  NEW_USER: 0,
  BASIC: 1,
  MEMBER: 2,
  REGULAR: 3,
  LEADER: 4,
} as const;

export type TrustLevel = (typeof TRUST_LEVELS)[keyof typeof TRUST_LEVELS];

/**
 * Trust level requirements for automatic promotion
 */
export const TRUST_LEVEL_REQUIREMENTS: Record<
  TrustLevel,
  TrustLevelRequirements
> = {
  [TRUST_LEVELS.NEW_USER]: {
    daysVisited: 0,
    topicsEntered: 0,
    postsRead: 0,
    timeRead: 0,
    likesReceived: 0,
    likesGiven: 0,
    topicsCreated: 0,
    postsCreated: 0,
  },
  [TRUST_LEVELS.BASIC]: {
    daysVisited: 1,
    topicsEntered: 5,
    postsRead: 30,
    timeRead: 10 * 60, // 10 minutes in seconds
    likesReceived: 0,
    likesGiven: 1,
    topicsCreated: 0,
    postsCreated: 0,
  },
  [TRUST_LEVELS.MEMBER]: {
    daysVisited: 15,
    topicsEntered: 20,
    postsRead: 100,
    timeRead: 60 * 60, // 1 hour in seconds
    likesReceived: 1,
    likesGiven: 10,
    topicsCreated: 3,
    postsCreated: 10,
  },
  [TRUST_LEVELS.REGULAR]: {
    daysVisited: 50,
    topicsEntered: 100,
    postsRead: 500,
    timeRead: 4 * 60 * 60, // 4 hours in seconds
    likesReceived: 20,
    likesGiven: 50,
    topicsCreated: 10,
    postsCreated: 50,
  },
  [TRUST_LEVELS.LEADER]: {
    daysVisited: 100,
    topicsEntered: 200,
    postsRead: 1000,
    timeRead: 10 * 60 * 60, // 10 hours in seconds
    likesReceived: 100,
    likesGiven: 200,
    topicsCreated: 30,
    postsCreated: 200,
  },
};

export interface TrustLevelRequirements {
  daysVisited: number;
  topicsEntered: number;
  postsRead: number;
  timeRead: number; // seconds
  likesReceived: number;
  likesGiven: number;
  topicsCreated: number;
  postsCreated: number;
}

export interface UserStats {
  daysVisited: number;
  topicsEntered: number;
  postsRead: number;
  timeRead: number;
  likesReceived: number;
  likesGiven: number;
  topicsCreated: number;
  postsCreated: number;
}

/**
 * Permissions that can be controlled by trust level
 */
export const PERMISSIONS = {
  // Topic permissions
  CREATE_TOPIC: "create_topic",
  REPLY_TO_TOPIC: "reply_to_topic",
  EDIT_OWN_POST: "edit_own_post",
  DELETE_OWN_POST: "delete_own_post",

  // Interaction permissions
  LIKE_POSTS: "like_posts",
  FLAG_POSTS: "flag_posts",
  SEND_PM: "send_pm",
  MENTION_USERS: "mention_users",

  // Content permissions
  POST_LINKS: "post_links",
  POST_IMAGES: "post_images",
  POST_ATTACHMENTS: "post_attachments",
  POST_EMBEDDED_MEDIA: "post_embedded_media",

  // Wiki/Edit permissions
  EDIT_WIKI_POSTS: "edit_wiki_posts",
  MAKE_WIKI: "make_wiki",

  // Advanced permissions
  INVITE_USERS: "invite_users",
  CREATE_TAGS: "create_tags",
  SEE_UNLISTED_TOPICS: "see_unlisted_topics",
  RECATEGORIZE_TOPICS: "recategorize_topics",
  RENAME_TOPICS: "rename_topics",

  // Moderation-lite permissions
  CLOSE_OWN_TOPICS: "close_own_topics",
  ARCHIVE_TOPICS: "archive_topics",
  SPLIT_MERGE_TOPICS: "split_merge_topics",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Default trust level permissions mapping
 */
const TRUST_LEVEL_PERMISSIONS: Record<TrustLevel, Permission[]> = {
  [TRUST_LEVELS.NEW_USER]: [
    PERMISSIONS.REPLY_TO_TOPIC,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.LIKE_POSTS,
  ],
  [TRUST_LEVELS.BASIC]: [
    PERMISSIONS.CREATE_TOPIC,
    PERMISSIONS.REPLY_TO_TOPIC,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.DELETE_OWN_POST,
    PERMISSIONS.LIKE_POSTS,
    PERMISSIONS.FLAG_POSTS,
    PERMISSIONS.SEND_PM,
    PERMISSIONS.MENTION_USERS,
    PERMISSIONS.POST_LINKS,
  ],
  [TRUST_LEVELS.MEMBER]: [
    PERMISSIONS.CREATE_TOPIC,
    PERMISSIONS.REPLY_TO_TOPIC,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.DELETE_OWN_POST,
    PERMISSIONS.LIKE_POSTS,
    PERMISSIONS.FLAG_POSTS,
    PERMISSIONS.SEND_PM,
    PERMISSIONS.MENTION_USERS,
    PERMISSIONS.POST_LINKS,
    PERMISSIONS.POST_IMAGES,
    PERMISSIONS.POST_ATTACHMENTS,
    PERMISSIONS.INVITE_USERS,
  ],
  [TRUST_LEVELS.REGULAR]: [
    PERMISSIONS.CREATE_TOPIC,
    PERMISSIONS.REPLY_TO_TOPIC,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.DELETE_OWN_POST,
    PERMISSIONS.LIKE_POSTS,
    PERMISSIONS.FLAG_POSTS,
    PERMISSIONS.SEND_PM,
    PERMISSIONS.MENTION_USERS,
    PERMISSIONS.POST_LINKS,
    PERMISSIONS.POST_IMAGES,
    PERMISSIONS.POST_ATTACHMENTS,
    PERMISSIONS.POST_EMBEDDED_MEDIA,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.EDIT_WIKI_POSTS,
    PERMISSIONS.CREATE_TAGS,
    PERMISSIONS.SEE_UNLISTED_TOPICS,
    PERMISSIONS.RECATEGORIZE_TOPICS,
    PERMISSIONS.RENAME_TOPICS,
  ],
  [TRUST_LEVELS.LEADER]: [
    PERMISSIONS.CREATE_TOPIC,
    PERMISSIONS.REPLY_TO_TOPIC,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.DELETE_OWN_POST,
    PERMISSIONS.LIKE_POSTS,
    PERMISSIONS.FLAG_POSTS,
    PERMISSIONS.SEND_PM,
    PERMISSIONS.MENTION_USERS,
    PERMISSIONS.POST_LINKS,
    PERMISSIONS.POST_IMAGES,
    PERMISSIONS.POST_ATTACHMENTS,
    PERMISSIONS.POST_EMBEDDED_MEDIA,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.EDIT_WIKI_POSTS,
    PERMISSIONS.MAKE_WIKI,
    PERMISSIONS.CREATE_TAGS,
    PERMISSIONS.SEE_UNLISTED_TOPICS,
    PERMISSIONS.RECATEGORIZE_TOPICS,
    PERMISSIONS.RENAME_TOPICS,
    PERMISSIONS.CLOSE_OWN_TOPICS,
    PERMISSIONS.ARCHIVE_TOPICS,
    PERMISSIONS.SPLIT_MERGE_TOPICS,
  ],
};

/**
 * Check if a user has a specific permission based on their trust level
 */
export function hasPermission(
  trustLevel: TrustLevel,
  permission: Permission,
  isAdmin = false,
  isModerator = false,
): boolean {
  // Admins and moderators have all permissions
  if (isAdmin || isModerator) {
    return true;
  }

  const permissions = TRUST_LEVEL_PERMISSIONS[trustLevel] || [];
  return permissions.includes(permission);
}

/**
 * Get all permissions for a trust level
 */
export function getPermissions(
  trustLevel: TrustLevel,
  isAdmin = false,
  isModerator = false,
): Permission[] {
  if (isAdmin || isModerator) {
    return Object.values(PERMISSIONS);
  }
  return TRUST_LEVEL_PERMISSIONS[trustLevel] || [];
}

/**
 * Check if user stats meet requirements for a trust level
 */
export function meetsRequirements(
  stats: UserStats,
  targetLevel: TrustLevel,
): boolean {
  const requirements = TRUST_LEVEL_REQUIREMENTS[targetLevel];

  return (
    stats.daysVisited >= requirements.daysVisited &&
    stats.topicsEntered >= requirements.topicsEntered &&
    stats.postsRead >= requirements.postsRead &&
    stats.timeRead >= requirements.timeRead &&
    stats.likesReceived >= requirements.likesReceived &&
    stats.likesGiven >= requirements.likesGiven &&
    stats.topicsCreated >= requirements.topicsCreated &&
    stats.postsCreated >= requirements.postsCreated
  );
}

/**
 * Calculate progress towards next trust level
 */
export function calculateProgress(
  stats: UserStats,
  currentLevel: TrustLevel,
): {
  canPromote: boolean;
  nextLevel: TrustLevel | null;
  progress: Record<
    string,
    { current: number; required: number; percentage: number }
  >;
} {
  const nextLevel = (currentLevel + 1) as TrustLevel;

  if (nextLevel > TRUST_LEVELS.LEADER) {
    return {
      canPromote: false,
      nextLevel: null,
      progress: {},
    };
  }

  const requirements = TRUST_LEVEL_REQUIREMENTS[nextLevel];

  const calcPercent = (current: number, required: number) =>
    required === 0
      ? 100
      : Math.min(100, Math.round((current / required) * 100));

  const progress = {
    daysVisited: {
      current: stats.daysVisited,
      required: requirements.daysVisited,
      percentage: calcPercent(stats.daysVisited, requirements.daysVisited),
    },
    topicsEntered: {
      current: stats.topicsEntered,
      required: requirements.topicsEntered,
      percentage: calcPercent(stats.topicsEntered, requirements.topicsEntered),
    },
    postsRead: {
      current: stats.postsRead,
      required: requirements.postsRead,
      percentage: calcPercent(stats.postsRead, requirements.postsRead),
    },
    timeRead: {
      current: stats.timeRead,
      required: requirements.timeRead,
      percentage: calcPercent(stats.timeRead, requirements.timeRead),
    },
    likesReceived: {
      current: stats.likesReceived,
      required: requirements.likesReceived,
      percentage: calcPercent(stats.likesReceived, requirements.likesReceived),
    },
    likesGiven: {
      current: stats.likesGiven,
      required: requirements.likesGiven,
      percentage: calcPercent(stats.likesGiven, requirements.likesGiven),
    },
    topicsCreated: {
      current: stats.topicsCreated,
      required: requirements.topicsCreated,
      percentage: calcPercent(stats.topicsCreated, requirements.topicsCreated),
    },
    postsCreated: {
      current: stats.postsCreated,
      required: requirements.postsCreated,
      percentage: calcPercent(stats.postsCreated, requirements.postsCreated),
    },
  };

  const canPromote = Object.values(progress).every((p) => p.percentage >= 100);

  return {
    canPromote,
    nextLevel,
    progress,
  };
}

/**
 * Get trust level name
 */
export function getTrustLevelName(level: TrustLevel): string {
  switch (level) {
    case TRUST_LEVELS.NEW_USER:
      return "New User";
    case TRUST_LEVELS.BASIC:
      return "Basic";
    case TRUST_LEVELS.MEMBER:
      return "Member";
    case TRUST_LEVELS.REGULAR:
      return "Regular";
    case TRUST_LEVELS.LEADER:
      return "Leader";
    default:
      return "Unknown";
  }
}

/**
 * Rate limiting based on trust level
 */
export const RATE_LIMITS: Record<TrustLevel, RateLimits> = {
  [TRUST_LEVELS.NEW_USER]: {
    topicsPerDay: 3,
    postsPerDay: 10,
    pmsPerDay: 0,
    likesPerDay: 20,
    flagsPerDay: 3,
  },
  [TRUST_LEVELS.BASIC]: {
    topicsPerDay: 10,
    postsPerDay: 50,
    pmsPerDay: 5,
    likesPerDay: 50,
    flagsPerDay: 10,
  },
  [TRUST_LEVELS.MEMBER]: {
    topicsPerDay: 20,
    postsPerDay: 100,
    pmsPerDay: 20,
    likesPerDay: 100,
    flagsPerDay: 20,
  },
  [TRUST_LEVELS.REGULAR]: {
    topicsPerDay: 50,
    postsPerDay: 200,
    pmsPerDay: 50,
    likesPerDay: 200,
    flagsPerDay: 50,
  },
  [TRUST_LEVELS.LEADER]: {
    topicsPerDay: 100,
    postsPerDay: 500,
    pmsPerDay: 100,
    likesPerDay: 500,
    flagsPerDay: 100,
  },
};

export interface RateLimits {
  topicsPerDay: number;
  postsPerDay: number;
  pmsPerDay: number;
  likesPerDay: number;
  flagsPerDay: number;
}

/**
 * Get rate limits for a trust level
 */
export function getRateLimits(
  trustLevel: TrustLevel,
  isAdmin = false,
  isModerator = false,
): RateLimits {
  if (isAdmin || isModerator) {
    return {
      topicsPerDay: Number.POSITIVE_INFINITY,
      postsPerDay: Number.POSITIVE_INFINITY,
      pmsPerDay: Number.POSITIVE_INFINITY,
      likesPerDay: Number.POSITIVE_INFINITY,
      flagsPerDay: Number.POSITIVE_INFINITY,
    };
  }
  return RATE_LIMITS[trustLevel] || RATE_LIMITS[TRUST_LEVELS.NEW_USER];
}
