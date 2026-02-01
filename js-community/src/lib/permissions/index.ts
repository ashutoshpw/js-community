/**
 * Permissions Module
 *
 * Exports trust level and permission utilities.
 */

export {
  checkAndPromoteUser,
  getUserStats,
  getUserTrustLevel,
  runTrustLevelPromotions,
  setUserTrustLevel,
} from "./trust-level-service";

export type {
  Permission,
  RateLimits,
  TrustLevel,
  TrustLevelRequirements,
  UserStats,
} from "./trust-levels";
export {
  calculateProgress,
  getPermissions,
  getRateLimits,
  getTrustLevelName,
  hasPermission,
  meetsRequirements,
  PERMISSIONS,
  RATE_LIMITS,
  TRUST_LEVEL_REQUIREMENTS,
  TRUST_LEVELS,
} from "./trust-levels";
