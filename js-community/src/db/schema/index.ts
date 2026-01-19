/**
 * Database schema exports
 *
 * This module exports all database schema definitions, relations, and types
 * for the application.
 */

export type {
  NewPost,
  NewPostAction,
  NewPostRevision,
  Post,
  PostAction,
  PostRevision,
} from "./posts";
// Post schemas
export {
  postActions,
  postActionsRelations,
  postRevisions,
  postRevisionsRelations,
  posts,
  postsRelations,
} from "./posts";
export type {
  NewTopic,
  NewTopicUser,
  Topic,
  TopicUser,
} from "./topics";
// Topic schemas
export {
  topics,
  topicsRelations,
  topicUsers,
  topicUsersRelations,
} from "./topics";
export type {
  NewUser,
  NewUserEmail,
  NewUserProfile,
  User,
  UserEmail,
  UserProfile,
} from "./users";
// User schemas
export {
  userEmails,
  userEmailsRelations,
  userProfiles,
  userProfilesRelations,
  users,
  usersRelations,
} from "./users";
