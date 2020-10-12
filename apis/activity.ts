import { gql } from "@apollo/client";

export const GET_ACTIVITIES = gql`
  query GetActivities($user_id: uuid!) {
    activity(
      where: {
        _and: [
          { user_id: { _eq: $user_id } }
          {
            _or: [
              { comment: { author_id: { _neq: $user_id } } }
              { reply: { author_id: { _neq: $user_id } } }
            ]
          }
        ]
      }
      order_by: { created_at: desc }
    ) {
      id
      read
      created_at
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

export const MARK_ACTIVITY_READ = gql`
  mutation MarkActivityRead($before: timestamptz!) {
    update_activity(
      _set: { read: true }
      where: { created_at: { _lte: $before } }
    ) {
      affected_rows
    }
  }
`;
