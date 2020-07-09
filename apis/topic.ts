import { gql } from "@apollo/client";

export const GET_TOPICS = gql`
  query GetTopics {
    category(order_by: { priority: desc }) {
      name
      id
      topics(order_by: { priority: desc }) {
        id
        name
        posts(order_by: { created_at: desc }, limit: 3) {
          id
          title
          author {
            username
            avatar_url
          }
          comments(
            distinct_on: author_id
            order_by: { author_id: asc, updated_at: desc }
          ) {
            author {
              username
              avatar_url
            }
          }
        }
      }
    }
  }
`;

export const GET_TOPIC_BY_ID = gql`
  query GetTopicById($id: Int!) {
    topic_by_pk(id: $id) {
      id
      name
    }
  }
`;
