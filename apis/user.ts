import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: uuid!) {
    user_by_pk(id: $id) {
      username
      avatar_url
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(where: { username: { _eq: $username } }) {
      id
      username
      avatar_url
      status
      created_at
      posts(order_by: { created_at: desc }, limit: 5) {
        id
        title
        created_at
      }
      comments(order_by: { created_at: desc }, limit: 5) {
        id
        created_at
        post {
          author {
            username
          }
          title
        }
      }
      replies(order_by: { created_at: desc }, limit: 5) {
        id
        created_at
        comment {
          post {
            author {
              username
            }
            title
          }
        }
      }
    }
  }
`;

export const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($username: String!, $avatar_url: String!) {
    update_user(
      where: { username: { _eq: $username } }
      _set: { avatar_url: $avatar_url }
    ) {
      returning {
        id
        avatar_url
      }
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($username: String!, $status: String!) {
    update_user(
      where: { username: { _eq: $username } }
      _set: { status: $status }
    ) {
      returning {
        id
        status
      }
    }
  }
`;

export const UPDATE_PUSH_SUBSCRIPTION = gql`
  mutation UpdatePushSubscription(
    $user_id: uuid!
    $web_push_subscription: String
  ) {
    update_user_by_pk(
      pk_columns: { id: $user_id }
      _set: { web_push_subscription: $web_push_subscription }
    ) {
      id
      web_push_enabled
    }
  }
`;
