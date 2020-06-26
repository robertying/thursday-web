import { gql } from "@apollo/client";

export const GET_TOPIC_POSTS = gql`
  query GetTopicPosts($id: Int!) {
    topic(where: { id: { _eq: $id } }) {
      id
      name
      posts(
        distinct_on: topic_id
        order_by: { topic_id: asc, revision: desc, updated_at: desc }
      ) {
        id
        revision
        title
        updated_at
      }
    }
  }
`;
