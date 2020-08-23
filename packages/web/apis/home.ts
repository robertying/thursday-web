import { gql } from "@apollo/client";

export const GET_TOP_POSTS = gql`
  query GetTopPosts {
    post(
      order_by: {
        comments_aggregate: { count: desc }
        reactions_aggregate: { count: desc }
      }
      limit: 5
    ) {
      id
      title
      content
      updated_at
      topic_id
      author {
        username
        avatar_url
      }
      comments(
        distinct_on: author_id
        order_by: { author_id: asc, updated_at: desc }
      ) {
        id
        author {
          username
          avatar_url
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      reactions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_NEWEST_POSTS = gql`
  query GetNewestPosts {
    post(order_by: { created_at: desc }, limit: 4) {
      id
      title
      content
      updated_at
      topic_id
      author {
        username
        avatar_url
      }
      comments(
        distinct_on: author_id
        order_by: { author_id: asc, updated_at: desc }
      ) {
        id
        author {
          username
          avatar_url
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      reactions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
