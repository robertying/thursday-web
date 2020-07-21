import { gql } from "@apollo/client";

export const ADD_REPLY = gql`
  mutation AddReply($author_id: uuid!, $content: String!, $comment_id: Int!) {
    insert_reply_one(
      object: {
        author_id: $author_id
        content: $content
        comment_id: $comment_id
      }
    ) {
      id
    }
  }
`;

export const GET_REPLIES = gql`
  query GetReplies($comment_id: Int!) {
    reply(
      where: { comment_id: { _eq: $comment_id } }
      order_by: { created_at: asc }
    ) {
      id
      created_at
      content
      author {
        username
        avatar_url
      }
    }
  }
`;

export const UPDATE_REPLY = gql`
  mutation UpdateReply($reply_id: Int!, $content: String!) {
    update_reply_by_pk(
      pk_columns: { id: $reply_id }
      _set: { content: $content }
    ) {
      id
    }
  }
`;
