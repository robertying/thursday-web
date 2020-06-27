import { gql } from "@apollo/client";

export const ADD_REACTION = gql`
  mutation AddReaction(
    $post_id: Int
    $comment_id: Int
    $user_id: uuid!
    $reaction: emoji_reaction_enum!
  ) {
    insert_reaction_one(
      object: {
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
