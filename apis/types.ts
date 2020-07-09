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
  name: string;
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
// GraphQL query operation: GetTopicPosts
// ====================================================

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
  title: string;
  content: string;
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

//==============================================================
// START Enums and Input Objects
//==============================================================

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

//==============================================================
// END Enums and Input Objects
//==============================================================
