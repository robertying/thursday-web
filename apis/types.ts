/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPost
// ====================================================

export interface GetPost_post_author {
  __typename: "user";
  id: any;
  username: string;
  avatar_url: string | null;
}

export interface GetPost_post_topic {
  __typename: "topic";
  name: string;
}

export interface GetPost_post {
  __typename: "post";
  id: number;
  revision: number;
  title: string;
  content: string;
  /**
   * An object relationship
   */
  author: GetPost_post_author;
  /**
   * An object relationship
   */
  topic: GetPost_post_topic;
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

export interface GetTopicPosts_topic_posts {
  __typename: "post";
  id: number;
  revision: number;
  title: string;
  updated_at: any;
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

export interface GetTopics_topic_posts {
  __typename: "post";
  title: string;
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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
