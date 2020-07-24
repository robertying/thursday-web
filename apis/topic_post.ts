import { gql } from "@apollo/client";

export const GET_TOPIC_POSTS = gql`
  query GetTopicPosts($id: Int!) {
    topic(where: { id: { _eq: $id } }) {
      id
      name
      posts(order_by: { updated_at: desc }) {
        id
        topic_id
        title
        content
        post_tags {
          tag {
            name
            id
          }
        }
        updated_at
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
      }
    }
  }
`;

export const GET_TOPIC_POSTS_BY_TAGS = gql`
  query GetTopicPostsByTags($id: Int!, $tags: [String!]!) {
    topic(where: { id: { _eq: $id } }) {
      id
      name
      posts(
        where: { post_tags: { tag: { name: { _in: $tags } } } }
        order_by: { updated_at: desc }
      ) {
        id
        topic_id
        title
        content
        post_tags {
          tag {
            name
            id
          }
        }
        updated_at
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
      }
    }
  }
`;
