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
