/**
 * Database schema exports
 *
 * This module exports all database schema definitions, relations, and types
 * for the application.
 */

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
  usersRelations,
} from "./users";
