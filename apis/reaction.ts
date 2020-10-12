import { gql } from "@apollo/client";

export const GET_SELF_REACTIONS = gql`
  query GetSelfReactions($post_id: Int!, $user_id: uuid!) {
    reaction(
      where: { post_id: { _eq: $post_id }, user_id: { _eq: $user_id } }
    ) {
      id
      reaction
    }
  }
`;

export const ADD_REACTION = gql`
  mutation AddReaction(
    $id: String!
    $post_id: Int
    $comment_id: Int
    $user_id: uuid!
    $reaction: emoji_reaction_enum!
  ) {
    insert_reaction_one(
      object: {
        id: $id
        post_id: $post_id
        comment_id: $comment_id
        user_id: $user_id
        reaction: $reaction
      }
    ) {
      id
    }
  }
`;

export const DELETE_REACTION = gql`
  mutation DeleteReaction($id: String!) {
    delete_reaction_by_pk(id: $id) {
      id
    }
  }
`;
