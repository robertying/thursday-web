import { gql } from "@apollo/client";

export const GET_POST = gql`
  query GetPost($id: Int!) {
    post(where: { id: { _eq: $id } }) {
      id
      topic {
        id
        name
      }
      title
      content
      reaction_aggregate {
        confused_face
        eyes
        grinning_face_with_smiling_eyes
        party_popper
        red_heart
        rocket
        thumbs_down
        thumbs_up
      }
      updated_at
      author {
        username
        avatar_url
        status
      }
      comments(order_by: { created_at: asc }) {
        id
        content
        reaction_aggregate {
          confused_face
          eyes
          grinning_face_with_smiling_eyes
          party_popper
          red_heart
          rocket
          thumbs_down
          thumbs_up
        }
        updated_at
        author {
          username
          avatar_url
          status
        }
        replies_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost(
    $author_id: uuid!
    $title: String!
    $content: String!
    $topic_id: Int!
  ) {
    insert_post_one(
      object: {
        author_id: $author_id
        title: $title
        content: $content
        topic_id: $topic_id
      }
    ) {
      id
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($post_id: Int!, $title: String!, $content: String!) {
    update_post_by_pk(
      pk_columns: { id: $post_id }
      _set: { title: $title, content: $content }
    ) {
      id
    }
  }
`;
