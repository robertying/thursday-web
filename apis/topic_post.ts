import { gql } from "@apollo/client";

export const GET_TOPIC_POSTS = gql`
  query GetTopicPosts($id: Int!) {
    topic(where: { id: { _eq: $id } }) {
      id
      name
      posts(order_by: { updated_at: desc }) {
        id
        title
        content
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
