import { gql } from "@apollo/client";

export const GET_ACTIVITIES = gql`
  query GetActivities($user_id: uuid!) {
    activity(
      where: { user_id: { _eq: $user_id } }
      order_by: { created_at: desc }
    ) {
      id
      read
      comment {
        id
        author {
          username
          avatar_url
        }
        post {
          topic_id
          id
          title
        }
        content
      }
      reply {
        id
        author {
          username
          avatar_url
        }
        comment {
          id
          content
          post {
            topic_id
            id
            title
          }
        }
        content
      }
    }
  }
`;
