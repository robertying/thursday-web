import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
  mutation AddComment($author_id: uuid!, $content: String!, $post_id: Int!) {
    insert_comment_one(
      object: { author_id: $author_id, content: $content, post_id: $post_id }
    ) {
      id
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($comment_id: Int!, $content: String!) {
    update_comment_by_pk(
      pk_columns: { id: $comment_id }
      _set: { content: $content }
    ) {
      id
    }
  }
`;
