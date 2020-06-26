import { gql } from "@apollo/client";

export const GET_TOPICS = gql`
  query GetTopics {
    topic(order_by: { priority: desc }) {
      id
      name
      posts(order_by: { created_at: desc }, limit: 2) {
        title
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
