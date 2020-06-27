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

export interface GetPost_post_reaction {
  __typename: "post_reaction";
  confused_face: any | null;
  eyes: any | null;
  grinning_face_with_smiling_eyes: any | null;
  party_popper: any | null;
  red_heart: any | null;
  rocket: any | null;
  thumbs_down: any | null;
  thumbs_up: any | null;
}

export interface GetPost_post_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
  status: string | null;
}

export interface GetPost_post_comments_reaction {
  __typename: "comment_reaction";
  confused_face: any | null;
  eyes: any | null;
  grinning_face_with_smiling_eyes: any | null;
  party_popper: any | null;
  red_heart: any | null;
  rocket: any | null;
  thumbs_down: any | null;
  thumbs_up: any | null;
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
  reaction: GetPost_post_comments_reaction | null;
  updated_at: any;
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
  reaction: GetPost_post_reaction | null;
  updated_at: any;
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
  author_id: any;
  title: string;
  content: string;
  topic_id: number;
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
  updated_at: any;
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

export interface GetTopics_topic_posts_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopics_topic_posts_comments_author {
  __typename: "user";
  username: string;
  avatar_url: string | null;
}

export interface GetTopics_topic_posts_comments {
  __typename: "comment";
  /**
   * An object relationship
   */
  author: GetTopics_topic_posts_comments_author;
}

export interface GetTopics_topic_posts {
  __typename: "post";
  id: number;
  title: string;
  /**
   * An object relationship
   */
  author: GetTopics_topic_posts_author;
  /**
   * An array relationship
   */
  comments: GetTopics_topic_posts_comments[];
}

export interface GetTopics_topic {
  __typename: "topic";
  id: number;
  name: string;
  /**
   * An array relationship
   */
  posts: GetTopics_topic_posts[];
}

export interface GetTopics {
  /**
   * fetch data from the table: "topic"
   */
  topic: GetTopics_topic[];
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
// GraphQL mutation operation: AddReaction
// ====================================================

export interface AddReaction_insert_reaction_one {
  __typename: "reaction";
  id: any;
}

export interface AddReaction {
  /**
   * insert a single row into the table: "reaction"
   */
  insert_reaction_one: AddReaction_insert_reaction_one | null;
}

export interface AddReactionVariables {
  post_id?: number | null;
  comment_id?: number | null;
  user_id: any;
  reaction: emoji_reaction_enum;
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
