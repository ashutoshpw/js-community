/**
 * Database schema exports
 *
 * This module exports all database schema definitions, relations, and types
 * for the application.
 */

// Auth schemas
export type {
  Account,
  NewAccount,
  NewPasswordResetToken,
  NewSession,
  NewVerificationToken,
  PasswordResetToken,
  Session,
  VerificationToken,
} from "./auth";
export {
  accounts,
  accountsRelations,
  passwordResetTokens,
  passwordResetTokensRelations,
  sessions,
  sessionsRelations,
  verificationTokens,
} from "./auth";
// Bookmark schemas
export type { Bookmark, NewBookmark } from "./bookmarks";
export { bookmarks, bookmarksRelations } from "./bookmarks";
// Category schemas
export type {
  Category,
  CategoryGroup,
  CategoryUser,
  NewCategory,
  NewCategoryGroup,
  NewCategoryUser,
} from "./categories";
export {
  categories,
  categoriesRelations,
  categoryGroups,
  categoryGroupsRelations,
  categoryUsers,
  categoryUsersRelations,
} from "./categories";
// Group schemas
export type {
  Group,
  GroupHistory,
  GroupMention,
  GroupUser,
  NewGroup,
  NewGroupHistory,
  NewGroupMention,
  NewGroupUser,
} from "./groups";
export {
  groupHistories,
  groupHistoriesRelations,
  groupMentions,
  groupMentionsRelations,
  groups,
  groupsRelations,
  groupUsers,
  groupUsersRelations,
} from "./groups";
// Private Messages schemas
export type {
  Conversation,
  ConversationParticipant,
  NewConversation,
  NewConversationParticipant,
  NewPrivateMessage,
  PrivateMessage,
} from "./messages";
export {
  conversationParticipants,
  conversationParticipantsRelations,
  conversations,
  conversationsRelations,
  privateMessages,
  privateMessagesRelations,
} from "./messages";
// Moderation schemas
export type {
  ModeratorAction,
  NewModeratorAction,
  NewReviewable,
  NewReviewableScore,
  NewUserWarning,
  Reviewable,
  ReviewableScore,
  UserWarning,
} from "./moderation";
export {
  moderatorActions,
  moderatorActionsRelations,
  reviewableScores,
  reviewableScoresRelations,
  reviewables,
  reviewablesRelations,
  userWarnings,
} from "./moderation";
// Notification schemas
export type {
  NewNotification,
  NewNotificationPreference,
  Notification,
  NotificationData,
  NotificationPreference,
  NotificationType,
} from "./notifications";
export {
  NOTIFICATION_TYPES,
  notificationPreferences,
  notificationPreferencesRelations,
  notifications,
  notificationsRelations,
} from "./notifications";
// Permission schemas
export type {
  Badge,
  NewBadge,
  NewPermissionType,
  NewPostActionType,
  NewTrustLevelGrant,
  NewUserActionType,
  NewUserBadge,
  PermissionType,
  PostActionType,
  TrustLevelGrant,
  UserActionType,
  UserBadge,
} from "./permissions";
export {
  badges,
  badgesRelations,
  permissionTypes,
  permissionTypesRelations,
  postActionTypes,
  postActionTypesRelations,
  trustLevelGrants,
  trustLevelGrantsRelations,
  userActionTypes,
  userActionTypesRelations,
  userBadges,
  userBadgesRelations,
} from "./permissions";
// Post schemas
export type {
  NewPost,
  NewPostAction,
  NewPostRevision,
  Post,
  PostAction,
  PostRevision,
} from "./posts";
export {
  postActions,
  postActionsRelations,
  postRevisions,
  postRevisionsRelations,
  posts,
  postsRelations,
} from "./posts";
// Site Settings schemas (admin)
export { adminActions, siteSettings, userBans } from "./site-settings";
// Tag schemas
export type {
  CategoryTag,
  NewCategoryTag,
  NewTag,
  NewTagGroup,
  NewTagGroupMembership,
  NewTagUser,
  NewTopicTag,
  Tag,
  TagGroup,
  TagGroupMembership,
  TagUser,
  TopicTag,
} from "./tags";
export {
  categoryTags,
  categoryTagsRelations,
  tagGroupMemberships,
  tagGroupMembershipsRelations,
  tagGroups,
  tagGroupsRelations,
  tags,
  tagsRelations,
  tagUsers,
  tagUsersRelations,
  topicTags,
  topicTagsRelations,
} from "./tags";
// Topic schemas
export type {
  NewTopic,
  NewTopicUser,
  Topic,
  TopicUser,
} from "./topics";
export {
  topics,
  topicsRelations,
  topicUsers,
  topicUsersRelations,
} from "./topics";
// User Actions schemas
export type {
  NewUserAction,
  NewUserStat,
  UserAction,
  UserActionTypeKey,
  UserStat,
} from "./userActions";
export {
  USER_ACTION_TYPES,
  userActions,
  userActionsRelations,
  userStats,
  userStatsRelations,
} from "./userActions";
// User schemas
export type {
  NewUser,
  NewUserEmail,
  NewUserProfile,
  User,
  UserEmail,
  UserProfile,
} from "./users";
export {
  userEmails,
  userEmailsRelations,
  userProfiles,
  userProfilesRelations,
  users,
  users as user, // Alias for better-auth compatibility
  usersRelations,
} from "./users";
