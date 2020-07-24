/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActivities
// ====================================================

export interface GetActivities_activity_comment_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetActivities_activity_comment_post {
  __typename: "post";
  topic_id: number;
  id: number;
  title: string;
}

export interface GetActivities_activity_comment {
  __typename: "comment";
  id: number;
  /**
   * An object relationship
   */
  author: GetActivities_activity_comment_author;
  /**
   * An object relationship
   */
  post: GetActivities_activity_comment_post | null;
  content: string;
}

export interface GetActivities_activity_reply_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetActivities_activity_reply_comment_post {
  __typename: "post";
  topic_id: number;
  id: number;
  title: string;
}

export interface GetActivities_activity_reply_comment {
  __typename: "comment";
  id: number;
  content: string;
  /**
   * An object relationship
   */
  post: GetActivities_activity_reply_comment_post | null;
}

export interface GetActivities_activity_reply {
  __typename: "reply";
  id: number;
  /**
   * An object relationship
   */
  author: GetActivities_activity_reply_author;
  /**
   * An object relationship
   */
  comment: GetActivities_activity_reply_comment;
  content: string;
}

export interface GetActivities_activity {
  __typename: "activity";
  id: string;
  read: boolean;
  created_at: timestamptz;
  /**
   * An object relationship
   */
  comment: GetActivities_activity_comment | null;
  /**
   * An object relationship
   */
  reply: GetActivities_activity_reply | null;
}

export interface GetActivities {
  /**
   * fetch data from the table: "activity"
   */
  activity: GetActivities_activity[];
}

export interface GetActivitiesVariables {
  user_id: uuid;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkActivityRead
// ====================================================

export interface MarkActivityRead_update_activity {
  __typename: "activity_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface MarkActivityRead {
  /**
   * update data of the table: "activity"
   */
  update_activity: MarkActivityRead_update_activity | null;
}

export interface MarkActivityReadVariables {
  before: timestamptz;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddComment
// ====================================================

export interface AddComment_insert_comment_one {
  __typename: "comment";
  id: number;
}

export interface AddComment {
  /**
   * insert a single row into the table: "comment"
   */
  insert_comment_one: AddComment_insert_comment_one | null;
}

export interface AddCommentVariables {
  author_id: uuid;
  content: string;
  post_id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateComment
// ====================================================

export interface UpdateComment_update_comment_by_pk {
  __typename: "comment";
  id: number;
}

export interface UpdateComment {
  /**
   * update single row of the table: "comment"
   */
  update_comment_by_pk: UpdateComment_update_comment_by_pk | null;
}

export interface UpdateCommentVariables {
  comment_id: number;
  content: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTopPosts
// ====================================================

export interface GetTopPosts_post_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopPosts_post_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopPosts_post_comments {
  __typename: "comment";
  id: number;
  /**
   * An object relationship
   */
  author: GetTopPosts_post_comments_author;
}

export interface GetTopPosts_post_comments_aggregate_aggregate {
  __typename: "comment_aggregate_fields";
  count: number | null;
}

export interface GetTopPosts_post_comments_aggregate {
  __typename: "comment_aggregate";
  aggregate: GetTopPosts_post_comments_aggregate_aggregate | null;
}

export interface GetTopPosts_post_reactions_aggregate_aggregate {
  __typename: "reaction_aggregate_fields";
  count: number | null;
}

export interface GetTopPosts_post_reactions_aggregate {
  __typename: "reaction_aggregate";
  aggregate: GetTopPosts_post_reactions_aggregate_aggregate | null;
}

export interface GetTopPosts_post {
  __typename: "post";
  id: number;
  title: string;
  content: string;
  updated_at: timestamptz;
  topic_id: number;
  /**
   * An object relationship
   */
  author: GetTopPosts_post_author;
  /**
   * An array relationship
   */
  comments: GetTopPosts_post_comments[];
  /**
   * An aggregated array relationship
   */
  comments_aggregate: GetTopPosts_post_comments_aggregate;
  /**
   * An aggregated array relationship
   */
  reactions_aggregate: GetTopPosts_post_reactions_aggregate;
}

export interface GetTopPosts {
  /**
   * fetch data from the table: "post"
   */
  post: GetTopPosts_post[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNewestPosts
// ====================================================

export interface GetNewestPosts_post_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetNewestPosts_post_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetNewestPosts_post_comments {
  __typename: "comment";
  id: number;
  /**
   * An object relationship
   */
  author: GetNewestPosts_post_comments_author;
}

export interface GetNewestPosts_post_comments_aggregate_aggregate {
  __typename: "comment_aggregate_fields";
  count: number | null;
}

export interface GetNewestPosts_post_comments_aggregate {
  __typename: "comment_aggregate";
  aggregate: GetNewestPosts_post_comments_aggregate_aggregate | null;
}

export interface GetNewestPosts_post_reactions_aggregate_aggregate {
  __typename: "reaction_aggregate_fields";
  count: number | null;
}

export interface GetNewestPosts_post_reactions_aggregate {
  __typename: "reaction_aggregate";
  aggregate: GetNewestPosts_post_reactions_aggregate_aggregate | null;
}

export interface GetNewestPosts_post {
  __typename: "post";
  id: number;
  title: string;
  content: string;
  updated_at: timestamptz;
  topic_id: number;
  /**
   * An object relationship
   */
  author: GetNewestPosts_post_author;
  /**
   * An array relationship
   */
  comments: GetNewestPosts_post_comments[];
  /**
   * An aggregated array relationship
   */
  comments_aggregate: GetNewestPosts_post_comments_aggregate;
  /**
   * An aggregated array relationship
   */
  reactions_aggregate: GetNewestPosts_post_reactions_aggregate;
}

export interface GetNewestPosts {
  /**
   * fetch data from the table: "post"
   */
  post: GetNewestPosts_post[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPost
// ====================================================

export interface GetPost_post_topic {
  __typename: "topic";
  id: number;
  name: string;
}

export interface GetPost_post_post_tags_tag {
  __typename: "tag";
  name: string;
  id: uuid;
}

export interface GetPost_post_post_tags {
  __typename: "post_tag";
  /**
   * An object relationship
   */
  tag: GetPost_post_post_tags_tag;
}

export interface GetPost_post_reaction_aggregate {
  __typename: "post_reaction";
  confused_face: bigint | null;
  eyes: bigint | null;
  grinning_face_with_smiling_eyes: bigint | null;
  party_popper: bigint | null;
  red_heart: bigint | null;
  rocket: bigint | null;
  thumbs_down: bigint | null;
  thumbs_up: bigint | null;
}

export interface GetPost_post_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
  status: string | null;
}

export interface GetPost_post_comments_reaction_aggregate {
  __typename: "comment_reaction";
  confused_face: bigint | null;
  eyes: bigint | null;
  grinning_face_with_smiling_eyes: bigint | null;
  party_popper: bigint | null;
  red_heart: bigint | null;
  rocket: bigint | null;
  thumbs_down: bigint | null;
  thumbs_up: bigint | null;
}

export interface GetPost_post_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
  status: string | null;
}

export interface GetPost_post_comments_replies_aggregate_aggregate {
  __typename: "reply_aggregate_fields";
  count: number | null;
}

export interface GetPost_post_comments_replies_aggregate {
  __typename: "reply_aggregate";
  aggregate: GetPost_post_comments_replies_aggregate_aggregate | null;
}

export interface GetPost_post_comments {
  __typename: "comment";
  id: number;
  content: string;
  /**
   * An object relationship
   */
  reaction_aggregate: GetPost_post_comments_reaction_aggregate | null;
  updated_at: timestamptz;
  /**
   * An object relationship
   */
  author: GetPost_post_comments_author;
  /**
   * An aggregated array relationship
   */
  replies_aggregate: GetPost_post_comments_replies_aggregate;
}

export interface GetPost_post {
  __typename: "post";
  id: number;
  /**
   * An object relationship
   */
  topic: GetPost_post_topic;
  title: string;
  content: string;
  /**
   * An array relationship
   */
  post_tags: GetPost_post_post_tags[];
  /**
   * An object relationship
   */
  reaction_aggregate: GetPost_post_reaction_aggregate | null;
  updated_at: timestamptz;
  /**
   * An object relationship
   */
  author: GetPost_post_author;
  /**
   * An array relationship
   */
  comments: GetPost_post_comments[];
}

export interface GetPost {
  /**
   * fetch data from the table: "post"
   */
  post: GetPost_post[];
}

export interface GetPostVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPost
// ====================================================

export interface AddPost_insert_post_one {
  __typename: "post";
  id: number;
}

export interface AddPost {
  /**
   * insert a single row into the table: "post"
   */
  insert_post_one: AddPost_insert_post_one | null;
}

export interface AddPostVariables {
  author_id: uuid;
  title: string;
  content: string;
  topic_id: number;
  tags: post_tag_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePost
// ====================================================

export interface UpdatePost_update_post_by_pk {
  __typename: "post";
  id: number;
}

export interface UpdatePost_delete_post_tag {
  __typename: "post_tag_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UpdatePost_insert_post_tag {
  __typename: "post_tag_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UpdatePost {
  /**
   * update single row of the table: "post"
   */
  update_post_by_pk: UpdatePost_update_post_by_pk | null;
  /**
   * delete data from the table: "post_tag"
   */
  delete_post_tag: UpdatePost_delete_post_tag | null;
  /**
   * insert data into the table: "post_tag"
   */
  insert_post_tag: UpdatePost_insert_post_tag | null;
}

export interface UpdatePostVariables {
  post_id: number;
  title: string;
  content: string;
  tags: post_tag_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSelfReactions
// ====================================================

export interface GetSelfReactions_reaction {
  __typename: "reaction";
  id: string;
  reaction: emoji_reaction_enum;
}

export interface GetSelfReactions {
  /**
   * fetch data from the table: "reaction"
   */
  reaction: GetSelfReactions_reaction[];
}

export interface GetSelfReactionsVariables {
  post_id: number;
  user_id: uuid;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddReaction
// ====================================================

export interface AddReaction_insert_reaction_one {
  __typename: "reaction";
  id: string;
}

export interface AddReaction {
  /**
   * insert a single row into the table: "reaction"
   */
  insert_reaction_one: AddReaction_insert_reaction_one | null;
}

export interface AddReactionVariables {
  id: string;
  post_id?: number | null;
  comment_id?: number | null;
  user_id: uuid;
  reaction: emoji_reaction_enum;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteReaction
// ====================================================

export interface DeleteReaction_delete_reaction_by_pk {
  __typename: "reaction";
  id: string;
}

export interface DeleteReaction {
  /**
   * delete single row from the table: "reaction"
   */
  delete_reaction_by_pk: DeleteReaction_delete_reaction_by_pk | null;
}

export interface DeleteReactionVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddReply
// ====================================================

export interface AddReply_insert_reply_one {
  __typename: "reply";
  id: number;
}

export interface AddReply {
  /**
   * insert a single row into the table: "reply"
   */
  insert_reply_one: AddReply_insert_reply_one | null;
}

export interface AddReplyVariables {
  author_id: uuid;
  content: string;
  comment_id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetReplies
// ====================================================

export interface GetReplies_reply_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetReplies_reply {
  __typename: "reply";
  id: number;
  created_at: timestamptz;
  content: string;
  /**
   * An object relationship
   */
  author: GetReplies_reply_author;
}

export interface GetReplies {
  /**
   * fetch data from the table: "reply"
   */
  reply: GetReplies_reply[];
}

export interface GetRepliesVariables {
  comment_id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateReply
// ====================================================

export interface UpdateReply_update_reply_by_pk {
  __typename: "reply";
  id: number;
}

export interface UpdateReply {
  /**
   * update single row of the table: "reply"
   */
  update_reply_by_pk: UpdateReply_update_reply_by_pk | null;
}

export interface UpdateReplyVariables {
  reply_id: number;
  content: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTopicPosts
// ====================================================

export interface GetTopicPosts_topic_posts_post_tags_tag {
  __typename: "tag";
  name: string;
  id: uuid;
}

export interface GetTopicPosts_topic_posts_post_tags {
  __typename: "post_tag";
  /**
   * An object relationship
   */
  tag: GetTopicPosts_topic_posts_post_tags_tag;
}

export interface GetTopicPosts_topic_posts_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopicPosts_topic_posts_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopicPosts_topic_posts_comments {
  __typename: "comment";
  id: number;
  /**
   * An object relationship
   */
  author: GetTopicPosts_topic_posts_comments_author;
}

export interface GetTopicPosts_topic_posts {
  __typename: "post";
  id: number;
  topic_id: number;
  title: string;
  content: string;
  /**
   * An array relationship
   */
  post_tags: GetTopicPosts_topic_posts_post_tags[];
  updated_at: timestamptz;
  /**
   * An object relationship
   */
  author: GetTopicPosts_topic_posts_author;
  /**
   * An array relationship
   */
  comments: GetTopicPosts_topic_posts_comments[];
}

export interface GetTopicPosts_topic {
  __typename: "topic";
  id: number;
  name: string;
  /**
   * An array relationship
   */
  posts: GetTopicPosts_topic_posts[];
}

export interface GetTopicPosts {
  /**
   * fetch data from the table: "topic"
   */
  topic: GetTopicPosts_topic[];
}

export interface GetTopicPostsVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTopicPostsByTags
// ====================================================

export interface GetTopicPostsByTags_topic_posts_post_tags_tag {
  __typename: "tag";
  name: string;
  id: uuid;
}

export interface GetTopicPostsByTags_topic_posts_post_tags {
  __typename: "post_tag";
  /**
   * An object relationship
   */
  tag: GetTopicPostsByTags_topic_posts_post_tags_tag;
}

export interface GetTopicPostsByTags_topic_posts_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopicPostsByTags_topic_posts_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopicPostsByTags_topic_posts_comments {
  __typename: "comment";
  id: number;
  /**
   * An object relationship
   */
  author: GetTopicPostsByTags_topic_posts_comments_author;
}

export interface GetTopicPostsByTags_topic_posts {
  __typename: "post";
  id: number;
  topic_id: number;
  title: string;
  content: string;
  /**
   * An array relationship
   */
  post_tags: GetTopicPostsByTags_topic_posts_post_tags[];
  updated_at: timestamptz;
  /**
   * An object relationship
   */
  author: GetTopicPostsByTags_topic_posts_author;
  /**
   * An array relationship
   */
  comments: GetTopicPostsByTags_topic_posts_comments[];
}

export interface GetTopicPostsByTags_topic {
  __typename: "topic";
  id: number;
  name: string;
  /**
   * An array relationship
   */
  posts: GetTopicPostsByTags_topic_posts[];
}

export interface GetTopicPostsByTags {
  /**
   * fetch data from the table: "topic"
   */
  topic: GetTopicPostsByTags_topic[];
}

export interface GetTopicPostsByTagsVariables {
  id: number;
  tags: string[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTopics
// ====================================================

export interface GetTopics_category_topics_posts_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopics_category_topics_posts_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopics_category_topics_posts_comments {
  __typename: "comment";
  id: number;
  /**
   * An object relationship
   */
  author: GetTopics_category_topics_posts_comments_author;
}

export interface GetTopics_category_topics_posts {
  __typename: "post";
  id: number;
  title: string;
  /**
   * An object relationship
   */
  author: GetTopics_category_topics_posts_author;
  /**
   * An array relationship
   */
  comments: GetTopics_category_topics_posts_comments[];
}

export interface GetTopics_category_topics {
  __typename: "topic";
  id: number;
  name: string;
  /**
   * An array relationship
   */
  posts: GetTopics_category_topics_posts[];
}

export interface GetTopics_category {
  __typename: "category";
  name: string;
  id: number;
  /**
   * An array relationship
   */
  topics: GetTopics_category_topics[];
}

export interface GetTopics {
  /**
   * fetch data from the table: "category"
   */
  category: GetTopics_category[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTopicById
// ====================================================

export interface GetTopicById_topic_by_pk {
  __typename: "topic";
  id: number;
  name: string;
}

export interface GetTopicById {
  /**
   * fetch data from the table: "topic" using primary key columns
   */
  topic_by_pk: GetTopicById_topic_by_pk | null;
}

export interface GetTopicByIdVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_by_pk {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetUser {
  /**
   * fetch data from the table: "user" using primary key columns
   */
  user_by_pk: GetUser_user_by_pk | null;
}

export interface GetUserVariables {
  id: uuid;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserProfile
// ====================================================

export interface GetUserProfile_user_posts {
  __typename: "post";
  id: number;
  title: string;
  created_at: timestamptz;
}

export interface GetUserProfile_user_comments_post_author {
  __typename: "user";
  username: string;
}

export interface GetUserProfile_user_comments_post {
  __typename: "post";
  /**
   * An object relationship
   */
  author: GetUserProfile_user_comments_post_author;
  title: string;
}

export interface GetUserProfile_user_comments {
  __typename: "comment";
  id: number;
  created_at: timestamptz;
  /**
   * An object relationship
   */
  post: GetUserProfile_user_comments_post | null;
}

export interface GetUserProfile_user_replies_comment_post_author {
  __typename: "user";
  username: string;
}

export interface GetUserProfile_user_replies_comment_post {
  __typename: "post";
  /**
   * An object relationship
   */
  author: GetUserProfile_user_replies_comment_post_author;
  title: string;
}

export interface GetUserProfile_user_replies_comment {
  __typename: "comment";
  /**
   * An object relationship
   */
  post: GetUserProfile_user_replies_comment_post | null;
}

export interface GetUserProfile_user_replies {
  __typename: "reply";
  id: number;
  created_at: timestamptz;
  /**
   * An object relationship
   */
  comment: GetUserProfile_user_replies_comment;
}

export interface GetUserProfile_user {
  __typename: "user";
  id: uuid;
  username: string;
  avatar_url: string | null;
  status: string | null;
  created_at: timestamptz;
  /**
   * An array relationship
   */
  posts: GetUserProfile_user_posts[];
  /**
   * An array relationship
   */
  comments: GetUserProfile_user_comments[];
  /**
   * An array relationship
   */
  replies: GetUserProfile_user_replies[];
}

export interface GetUserProfile {
  /**
   * fetch data from the table: "user"
   */
  user: GetUserProfile_user[];
}

export interface GetUserProfileVariables {
  username: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserAvatar
// ====================================================

export interface UpdateUserAvatar_update_user_returning {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface UpdateUserAvatar_update_user {
  __typename: "user_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: UpdateUserAvatar_update_user_returning[];
}

export interface UpdateUserAvatar {
  /**
   * update data of the table: "user"
   */
  update_user: UpdateUserAvatar_update_user | null;
}

export interface UpdateUserAvatarVariables {
  username: string;
  avatar_url: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserStatus
// ====================================================

export interface UpdateUserStatus_update_user_returning {
  __typename: "user";
  username: string;
  status: string | null;
}

export interface UpdateUserStatus_update_user {
  __typename: "user_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: UpdateUserStatus_update_user_returning[];
}

export interface UpdateUserStatus {
  /**
   * update data of the table: "user"
   */
  update_user: UpdateUserStatus_update_user | null;
}

export interface UpdateUserStatusVariables {
  username: string;
  status: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePushSubscription
// ====================================================

export interface UpdatePushSubscription_update_user_by_pk {
  __typename: "user";
  username: string;
  /**
   * A computed field, executes function "user_web_push_enabled"
   */
  web_push_enabled: boolean | null;
}

export interface UpdatePushSubscription {
  /**
   * update single row of the table: "user"
   */
  update_user_by_pk: UpdatePushSubscription_update_user_by_pk | null;
}

export interface UpdatePushSubscriptionVariables {
  user_id: uuid;
  web_push_subscription?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * unique or primary key constraints on table "category"
 */
export enum category_constraint {
  category_pkey = "category_pkey",
}

/**
 * update columns of table "category"
 */
export enum category_update_column {
  created_at = "created_at",
  id = "id",
  name = "name",
  priority = "priority",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "comment"
 */
export enum comment_constraint {
  comment_id_key = "comment_id_key",
  comment_pkey = "comment_pkey",
}

/**
 * unique or primary key constraints on table "comment_history"
 */
export enum comment_history_constraint {
  comment_history_pkey = "comment_history_pkey",
}

/**
 * update columns of table "comment_history"
 */
export enum comment_history_update_column {
  comment_id = "comment_id",
  content = "content",
  created_at = "created_at",
  revision = "revision",
  updated_at = "updated_at",
}

/**
 * update columns of table "comment"
 */
export enum comment_update_column {
  author_id = "author_id",
  content = "content",
  created_at = "created_at",
  deleted = "deleted",
  id = "id",
  post_id = "post_id",
  updated_at = "updated_at",
}

export enum emoji_reaction_enum {
  confused_face = "confused_face",
  eyes = "eyes",
  grinning_face_with_smiling_eyes = "grinning_face_with_smiling_eyes",
  party_popper = "party_popper",
  red_heart = "red_heart",
  rocket = "rocket",
  thumbs_down = "thumbs_down",
  thumbs_up = "thumbs_up",
}

/**
 * unique or primary key constraints on table "post"
 */
export enum post_constraint {
  post_id_key = "post_id_key",
  post_pkey = "post_pkey",
}

/**
 * unique or primary key constraints on table "post_history"
 */
export enum post_history_constraint {
  post_history_pkey = "post_history_pkey",
}

/**
 * update columns of table "post_history"
 */
export enum post_history_update_column {
  content = "content",
  created_at = "created_at",
  post_id = "post_id",
  revision = "revision",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "post_tag"
 */
export enum post_tag_constraint {
  post_tag_pkey = "post_tag_pkey",
}

/**
 * update columns of table "post_tag"
 */
export enum post_tag_update_column {
  post_id = "post_id",
  tag_id = "tag_id",
}

/**
 * update columns of table "post"
 */
export enum post_update_column {
  author_id = "author_id",
  content = "content",
  created_at = "created_at",
  deleted = "deleted",
  id = "id",
  revision = "revision",
  title = "title",
  topic_id = "topic_id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "reaction"
 */
export enum reaction_constraint {
  reaction_id_key = "reaction_id_key",
  reaction_pkey = "reaction_pkey",
}

/**
 * update columns of table "reaction"
 */
export enum reaction_update_column {
  comment_id = "comment_id",
  created_at = "created_at",
  id = "id",
  post_id = "post_id",
  reaction = "reaction",
  updated_at = "updated_at",
  user_id = "user_id",
}

/**
 * unique or primary key constraints on table "reply"
 */
export enum reply_constraint {
  reply_id_key = "reply_id_key",
  reply_pkey = "reply_pkey",
}

/**
 * unique or primary key constraints on table "reply_history"
 */
export enum reply_history_constraint {
  reply_history_pkey = "reply_history_pkey",
}

/**
 * update columns of table "reply_history"
 */
export enum reply_history_update_column {
  content = "content",
  created_at = "created_at",
  reply_id = "reply_id",
  revision = "revision",
  updated_at = "updated_at",
}

/**
 * update columns of table "reply"
 */
export enum reply_update_column {
  author_id = "author_id",
  comment_id = "comment_id",
  content = "content",
  created_at = "created_at",
  deleted = "deleted",
  id = "id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "tag"
 */
export enum tag_constraint {
  tag_name_key = "tag_name_key",
  tag_pkey = "tag_pkey",
}

/**
 * update columns of table "tag"
 */
export enum tag_update_column {
  created_at = "created_at",
  id = "id",
  name = "name",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "topic"
 */
export enum topic_constraint {
  topic_name_key = "topic_name_key",
  topic_pkey = "topic_pkey",
}

/**
 * update columns of table "topic"
 */
export enum topic_update_column {
  category_id = "category_id",
  created_at = "created_at",
  id = "id",
  name = "name",
  priority = "priority",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "user"
 */
export enum user_constraint {
  user_email_key = "user_email_key",
  user_pkey = "user_pkey",
  user_username_key = "user_username_key",
}

/**
 * update columns of table "user"
 */
export enum user_update_column {
  avatar_url = "avatar_url",
  created_at = "created_at",
  email = "email",
  id = "id",
  status = "status",
  updated_at = "updated_at",
  username = "username",
  web_push_subscription = "web_push_subscription",
}

/**
 * expression to compare columns of type Boolean. All fields are combined with logical 'AND'.
 */
export interface Boolean_comparison_exp {
  _eq?: boolean | null;
  _gt?: boolean | null;
  _gte?: boolean | null;
  _in?: boolean[] | null;
  _is_null?: boolean | null;
  _lt?: boolean | null;
  _lte?: boolean | null;
  _neq?: boolean | null;
  _nin?: boolean[] | null;
}

/**
 * expression to compare columns of type Int. All fields are combined with logical 'AND'.
 */
export interface Int_comparison_exp {
  _eq?: number | null;
  _gt?: number | null;
  _gte?: number | null;
  _in?: number[] | null;
  _is_null?: boolean | null;
  _lt?: number | null;
  _lte?: number | null;
  _neq?: number | null;
  _nin?: number[] | null;
}

/**
 * expression to compare columns of type String. All fields are combined with logical 'AND'.
 */
export interface String_comparison_exp {
  _eq?: string | null;
  _gt?: string | null;
  _gte?: string | null;
  _ilike?: string | null;
  _in?: string[] | null;
  _is_null?: boolean | null;
  _like?: string | null;
  _lt?: string | null;
  _lte?: string | null;
  _neq?: string | null;
  _nilike?: string | null;
  _nin?: string[] | null;
  _nlike?: string | null;
  _nsimilar?: string | null;
  _similar?: string | null;
}

/**
 * expression to compare columns of type bigint. All fields are combined with logical 'AND'.
 */
export interface bigint_comparison_exp {
  _eq?: bigint | null;
  _gt?: bigint | null;
  _gte?: bigint | null;
  _in?: bigint[] | null;
  _is_null?: boolean | null;
  _lt?: bigint | null;
  _lte?: bigint | null;
  _neq?: bigint | null;
  _nin?: bigint[] | null;
}

/**
 * Boolean expression to filter rows from the table "category". All fields are combined with a logical 'AND'.
 */
export interface category_bool_exp {
  _and?: (category_bool_exp | null)[] | null;
  _not?: category_bool_exp | null;
  _or?: (category_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: Int_comparison_exp | null;
  name?: String_comparison_exp | null;
  priority?: Int_comparison_exp | null;
  topics?: topic_bool_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "category"
 */
export interface category_insert_input {
  created_at?: timestamptz | null;
  id?: number | null;
  name?: string | null;
  priority?: number | null;
  topics?: topic_arr_rel_insert_input | null;
  updated_at?: timestamptz | null;
}

/**
 * input type for inserting object relation for remote table "category"
 */
export interface category_obj_rel_insert_input {
  data: category_insert_input;
  on_conflict?: category_on_conflict | null;
}

/**
 * on conflict condition type for table "category"
 */
export interface category_on_conflict {
  constraint: category_constraint;
  update_columns: category_update_column[];
  where?: category_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "comment"
 */
export interface comment_arr_rel_insert_input {
  data: comment_insert_input[];
  on_conflict?: comment_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "comment". All fields are combined with a logical 'AND'.
 */
export interface comment_bool_exp {
  _and?: (comment_bool_exp | null)[] | null;
  _not?: comment_bool_exp | null;
  _or?: (comment_bool_exp | null)[] | null;
  author?: user_bool_exp | null;
  author_id?: uuid_comparison_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  deleted?: Boolean_comparison_exp | null;
  history?: comment_history_bool_exp | null;
  id?: Int_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: Int_comparison_exp | null;
  reaction_aggregate?: comment_reaction_bool_exp | null;
  reactions?: reaction_bool_exp | null;
  replies?: reply_bool_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "comment_history"
 */
export interface comment_history_arr_rel_insert_input {
  data: comment_history_insert_input[];
  on_conflict?: comment_history_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "comment_history". All fields are combined with a logical 'AND'.
 */
export interface comment_history_bool_exp {
  _and?: (comment_history_bool_exp | null)[] | null;
  _not?: comment_history_bool_exp | null;
  _or?: (comment_history_bool_exp | null)[] | null;
  comment?: comment_bool_exp | null;
  comment_id?: Int_comparison_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  revision?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "comment_history"
 */
export interface comment_history_insert_input {
  comment?: comment_obj_rel_insert_input | null;
  comment_id?: number | null;
  content?: string | null;
  created_at?: timestamptz | null;
  revision?: number | null;
  updated_at?: timestamptz | null;
}

/**
 * on conflict condition type for table "comment_history"
 */
export interface comment_history_on_conflict {
  constraint: comment_history_constraint;
  update_columns: comment_history_update_column[];
  where?: comment_history_bool_exp | null;
}

/**
 * input type for inserting data into table "comment"
 */
export interface comment_insert_input {
  author?: user_obj_rel_insert_input | null;
  author_id?: uuid | null;
  content?: string | null;
  created_at?: timestamptz | null;
  deleted?: boolean | null;
  history?: comment_history_arr_rel_insert_input | null;
  id?: number | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: number | null;
  reactions?: reaction_arr_rel_insert_input | null;
  replies?: reply_arr_rel_insert_input | null;
  updated_at?: timestamptz | null;
}

/**
 * input type for inserting object relation for remote table "comment"
 */
export interface comment_obj_rel_insert_input {
  data: comment_insert_input;
  on_conflict?: comment_on_conflict | null;
}

/**
 * on conflict condition type for table "comment"
 */
export interface comment_on_conflict {
  constraint: comment_constraint;
  update_columns: comment_update_column[];
  where?: comment_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "comment_reaction". All fields are combined with a logical 'AND'.
 */
export interface comment_reaction_bool_exp {
  _and?: (comment_reaction_bool_exp | null)[] | null;
  _not?: comment_reaction_bool_exp | null;
  _or?: (comment_reaction_bool_exp | null)[] | null;
  comment_id?: Int_comparison_exp | null;
  confused_face?: bigint_comparison_exp | null;
  eyes?: bigint_comparison_exp | null;
  grinning_face_with_smiling_eyes?: bigint_comparison_exp | null;
  party_popper?: bigint_comparison_exp | null;
  red_heart?: bigint_comparison_exp | null;
  rocket?: bigint_comparison_exp | null;
  thumbs_down?: bigint_comparison_exp | null;
  thumbs_up?: bigint_comparison_exp | null;
}

/**
 * expression to compare columns of type emoji_reaction_enum. All fields are combined with logical 'AND'.
 */
export interface emoji_reaction_enum_comparison_exp {
  _eq?: emoji_reaction_enum | null;
  _in?: emoji_reaction_enum[] | null;
  _is_null?: boolean | null;
  _neq?: emoji_reaction_enum | null;
  _nin?: emoji_reaction_enum[] | null;
}

/**
 * input type for inserting array relation for remote table "post"
 */
export interface post_arr_rel_insert_input {
  data: post_insert_input[];
  on_conflict?: post_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post". All fields are combined with a logical 'AND'.
 */
export interface post_bool_exp {
  _and?: (post_bool_exp | null)[] | null;
  _not?: post_bool_exp | null;
  _or?: (post_bool_exp | null)[] | null;
  author?: user_bool_exp | null;
  author_id?: uuid_comparison_exp | null;
  comments?: comment_bool_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  deleted?: Boolean_comparison_exp | null;
  history?: post_history_bool_exp | null;
  id?: Int_comparison_exp | null;
  post_tags?: post_tag_bool_exp | null;
  reaction_aggregate?: post_reaction_bool_exp | null;
  reactions?: reaction_bool_exp | null;
  revision?: Int_comparison_exp | null;
  title?: String_comparison_exp | null;
  topic?: topic_bool_exp | null;
  topic_id?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "post_history"
 */
export interface post_history_arr_rel_insert_input {
  data: post_history_insert_input[];
  on_conflict?: post_history_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post_history". All fields are combined with a logical 'AND'.
 */
export interface post_history_bool_exp {
  _and?: (post_history_bool_exp | null)[] | null;
  _not?: post_history_bool_exp | null;
  _or?: (post_history_bool_exp | null)[] | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: Int_comparison_exp | null;
  revision?: Int_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "post_history"
 */
export interface post_history_insert_input {
  content?: string | null;
  created_at?: timestamptz | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: number | null;
  revision?: number | null;
  title?: string | null;
  updated_at?: timestamptz | null;
}

/**
 * on conflict condition type for table "post_history"
 */
export interface post_history_on_conflict {
  constraint: post_history_constraint;
  update_columns: post_history_update_column[];
  where?: post_history_bool_exp | null;
}

/**
 * input type for inserting data into table "post"
 */
export interface post_insert_input {
  author?: user_obj_rel_insert_input | null;
  author_id?: uuid | null;
  comments?: comment_arr_rel_insert_input | null;
  content?: string | null;
  created_at?: timestamptz | null;
  deleted?: boolean | null;
  history?: post_history_arr_rel_insert_input | null;
  id?: number | null;
  post_tags?: post_tag_arr_rel_insert_input | null;
  reactions?: reaction_arr_rel_insert_input | null;
  revision?: number | null;
  title?: string | null;
  topic?: topic_obj_rel_insert_input | null;
  topic_id?: number | null;
  updated_at?: timestamptz | null;
}

/**
 * input type for inserting object relation for remote table "post"
 */
export interface post_obj_rel_insert_input {
  data: post_insert_input;
  on_conflict?: post_on_conflict | null;
}

/**
 * on conflict condition type for table "post"
 */
export interface post_on_conflict {
  constraint: post_constraint;
  update_columns: post_update_column[];
  where?: post_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "post_reaction". All fields are combined with a logical 'AND'.
 */
export interface post_reaction_bool_exp {
  _and?: (post_reaction_bool_exp | null)[] | null;
  _not?: post_reaction_bool_exp | null;
  _or?: (post_reaction_bool_exp | null)[] | null;
  confused_face?: bigint_comparison_exp | null;
  eyes?: bigint_comparison_exp | null;
  grinning_face_with_smiling_eyes?: bigint_comparison_exp | null;
  party_popper?: bigint_comparison_exp | null;
  post_id?: Int_comparison_exp | null;
  red_heart?: bigint_comparison_exp | null;
  rocket?: bigint_comparison_exp | null;
  thumbs_down?: bigint_comparison_exp | null;
  thumbs_up?: bigint_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "post_tag"
 */
export interface post_tag_arr_rel_insert_input {
  data: post_tag_insert_input[];
  on_conflict?: post_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post_tag". All fields are combined with a logical 'AND'.
 */
export interface post_tag_bool_exp {
  _and?: (post_tag_bool_exp | null)[] | null;
  _not?: post_tag_bool_exp | null;
  _or?: (post_tag_bool_exp | null)[] | null;
  post?: post_bool_exp | null;
  post_id?: Int_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "post_tag"
 */
export interface post_tag_insert_input {
  post?: post_obj_rel_insert_input | null;
  post_id?: number | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_id?: uuid | null;
}

/**
 * on conflict condition type for table "post_tag"
 */
export interface post_tag_on_conflict {
  constraint: post_tag_constraint;
  update_columns: post_tag_update_column[];
  where?: post_tag_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "reaction"
 */
export interface reaction_arr_rel_insert_input {
  data: reaction_insert_input[];
  on_conflict?: reaction_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "reaction". All fields are combined with a logical 'AND'.
 */
export interface reaction_bool_exp {
  _and?: (reaction_bool_exp | null)[] | null;
  _not?: reaction_bool_exp | null;
  _or?: (reaction_bool_exp | null)[] | null;
  comment?: comment_bool_exp | null;
  comment_id?: Int_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: String_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: Int_comparison_exp | null;
  reaction?: emoji_reaction_enum_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
  user_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "reaction"
 */
export interface reaction_insert_input {
  comment?: comment_obj_rel_insert_input | null;
  comment_id?: number | null;
  created_at?: timestamptz | null;
  id?: string | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: number | null;
  reaction?: emoji_reaction_enum | null;
  updated_at?: timestamptz | null;
  user_id?: uuid | null;
}

/**
 * on conflict condition type for table "reaction"
 */
export interface reaction_on_conflict {
  constraint: reaction_constraint;
  update_columns: reaction_update_column[];
  where?: reaction_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "reply"
 */
export interface reply_arr_rel_insert_input {
  data: reply_insert_input[];
  on_conflict?: reply_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "reply". All fields are combined with a logical 'AND'.
 */
export interface reply_bool_exp {
  _and?: (reply_bool_exp | null)[] | null;
  _not?: reply_bool_exp | null;
  _or?: (reply_bool_exp | null)[] | null;
  author?: user_bool_exp | null;
  author_id?: uuid_comparison_exp | null;
  comment?: comment_bool_exp | null;
  comment_id?: Int_comparison_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  deleted?: Boolean_comparison_exp | null;
  history?: reply_history_bool_exp | null;
  id?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "reply_history"
 */
export interface reply_history_arr_rel_insert_input {
  data: reply_history_insert_input[];
  on_conflict?: reply_history_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "reply_history". All fields are combined with a logical 'AND'.
 */
export interface reply_history_bool_exp {
  _and?: (reply_history_bool_exp | null)[] | null;
  _not?: reply_history_bool_exp | null;
  _or?: (reply_history_bool_exp | null)[] | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  reply?: reply_bool_exp | null;
  reply_id?: Int_comparison_exp | null;
  revision?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "reply_history"
 */
export interface reply_history_insert_input {
  content?: string | null;
  created_at?: timestamptz | null;
  reply?: reply_obj_rel_insert_input | null;
  reply_id?: number | null;
  revision?: number | null;
  updated_at?: timestamptz | null;
}

/**
 * on conflict condition type for table "reply_history"
 */
export interface reply_history_on_conflict {
  constraint: reply_history_constraint;
  update_columns: reply_history_update_column[];
  where?: reply_history_bool_exp | null;
}

/**
 * input type for inserting data into table "reply"
 */
export interface reply_insert_input {
  author?: user_obj_rel_insert_input | null;
  author_id?: uuid | null;
  comment?: comment_obj_rel_insert_input | null;
  comment_id?: number | null;
  content?: string | null;
  created_at?: timestamptz | null;
  deleted?: boolean | null;
  history?: reply_history_arr_rel_insert_input | null;
  id?: number | null;
  updated_at?: timestamptz | null;
}

/**
 * input type for inserting object relation for remote table "reply"
 */
export interface reply_obj_rel_insert_input {
  data: reply_insert_input;
  on_conflict?: reply_on_conflict | null;
}

/**
 * on conflict condition type for table "reply"
 */
export interface reply_on_conflict {
  constraint: reply_constraint;
  update_columns: reply_update_column[];
  where?: reply_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'.
 */
export interface tag_bool_exp {
  _and?: (tag_bool_exp | null)[] | null;
  _not?: tag_bool_exp | null;
  _or?: (tag_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  name?: String_comparison_exp | null;
  tag_posts?: post_tag_bool_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "tag"
 */
export interface tag_insert_input {
  created_at?: timestamptz | null;
  id?: uuid | null;
  name?: string | null;
  tag_posts?: post_tag_arr_rel_insert_input | null;
  updated_at?: timestamptz | null;
}

/**
 * input type for inserting object relation for remote table "tag"
 */
export interface tag_obj_rel_insert_input {
  data: tag_insert_input;
  on_conflict?: tag_on_conflict | null;
}

/**
 * on conflict condition type for table "tag"
 */
export interface tag_on_conflict {
  constraint: tag_constraint;
  update_columns: tag_update_column[];
  where?: tag_bool_exp | null;
}

/**
 * expression to compare columns of type timestamptz. All fields are combined with logical 'AND'.
 */
export interface timestamptz_comparison_exp {
  _eq?: timestamptz | null;
  _gt?: timestamptz | null;
  _gte?: timestamptz | null;
  _in?: timestamptz[] | null;
  _is_null?: boolean | null;
  _lt?: timestamptz | null;
  _lte?: timestamptz | null;
  _neq?: timestamptz | null;
  _nin?: timestamptz[] | null;
}

/**
 * input type for inserting array relation for remote table "topic"
 */
export interface topic_arr_rel_insert_input {
  data: topic_insert_input[];
  on_conflict?: topic_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "topic". All fields are combined with a logical 'AND'.
 */
export interface topic_bool_exp {
  _and?: (topic_bool_exp | null)[] | null;
  _not?: topic_bool_exp | null;
  _or?: (topic_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: Int_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: Int_comparison_exp | null;
  name?: String_comparison_exp | null;
  posts?: post_bool_exp | null;
  priority?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "topic"
 */
export interface topic_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: number | null;
  created_at?: timestamptz | null;
  id?: number | null;
  name?: string | null;
  posts?: post_arr_rel_insert_input | null;
  priority?: number | null;
  updated_at?: timestamptz | null;
}

/**
 * input type for inserting object relation for remote table "topic"
 */
export interface topic_obj_rel_insert_input {
  data: topic_insert_input;
  on_conflict?: topic_on_conflict | null;
}

/**
 * on conflict condition type for table "topic"
 */
export interface topic_on_conflict {
  constraint: topic_constraint;
  update_columns: topic_update_column[];
  where?: topic_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'.
 */
export interface user_bool_exp {
  _and?: (user_bool_exp | null)[] | null;
  _not?: user_bool_exp | null;
  _or?: (user_bool_exp | null)[] | null;
  avatar_url?: String_comparison_exp | null;
  comments?: comment_bool_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  email?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  posts?: post_bool_exp | null;
  replies?: reply_bool_exp | null;
  status?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
  username?: String_comparison_exp | null;
  web_push_subscription?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "user"
 */
export interface user_insert_input {
  avatar_url?: string | null;
  comments?: comment_arr_rel_insert_input | null;
  created_at?: timestamptz | null;
  email?: string | null;
  id?: uuid | null;
  posts?: post_arr_rel_insert_input | null;
  replies?: reply_arr_rel_insert_input | null;
  status?: string | null;
  updated_at?: timestamptz | null;
  username?: string | null;
  web_push_subscription?: string | null;
}

/**
 * input type for inserting object relation for remote table "user"
 */
export interface user_obj_rel_insert_input {
  data: user_insert_input;
  on_conflict?: user_on_conflict | null;
}

/**
 * on conflict condition type for table "user"
 */
export interface user_on_conflict {
  constraint: user_constraint;
  update_columns: user_update_column[];
  where?: user_bool_exp | null;
}

/**
 * expression to compare columns of type uuid. All fields are combined with logical 'AND'.
 */
export interface uuid_comparison_exp {
  _eq?: uuid | null;
  _gt?: uuid | null;
  _gte?: uuid | null;
  _in?: uuid[] | null;
  _is_null?: boolean | null;
  _lt?: uuid | null;
  _lte?: uuid | null;
  _neq?: uuid | null;
  _nin?: uuid[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
