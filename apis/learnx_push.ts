import gql from "graphql-tag";

export const GET_LEARNX_PUSH_TOKENS = gql`
  query GetLearnXPushTokens($user_id: uuid!) {
    learnx_push_by_pk(user_id: $user_id) {
      user_id
      username
      password
      tokens
    }
  }
`;

export const ADD_LEARNX_PUSH_DEVICE = gql`
  mutation AddLearnXPushDevice(
    $user_id: uuid!
    $username: String!
    $password: String!
    $tokens: String!
  ) {
    insert_learnx_push_one(
      object: {
        user_id: $user_id
        username: $username
        password: $password
        tokens: $tokens
      }
      on_conflict: {
        constraint: learnx_push_pkey
        update_columns: [username, password, tokens]
      }
    ) {
      user_id
    }
  }
`;

export const DELETE_LEARNX_PUSH = gql`
  mutation DeleteLearnXPush($user_id: uuid!) {
    delete_learnx_push_by_pk(user_id: $user_id) {
      user_id
      username
    }
  }
`;
