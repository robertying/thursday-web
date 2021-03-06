import { gql } from "@apollo/client";
import {
  post_tag_insert_input,
  tag_constraint,
  tag_obj_rel_insert_input,
  tag_update_column,
} from "./types";

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
      post_tags {
        tag {
          name
          id
        }
      }
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

export const getTagInput = (name: string): tag_obj_rel_insert_input => ({
  data: { name },
  on_conflict: {
    constraint: tag_constraint.tag_name_key,
    update_columns: [tag_update_column.name],
  },
});

export const ADD_POST = gql`
  mutation AddPost(
    $author_id: uuid!
    $title: String!
    $content: String!
    $topic_id: Int!
    $tags: [post_tag_insert_input!]!
  ) {
    insert_post_one(
      object: {
        author_id: $author_id
        title: $title
        content: $content
        topic_id: $topic_id
        post_tags: { data: $tags }
      }
    ) {
      id
    }
  }
`;

export const getPostTagInput = (
  post_id: number,
  name: string
): post_tag_insert_input => ({
  post_id,
  tag: {
    data: { name },
    on_conflict: {
      constraint: tag_constraint.tag_name_key,
      update_columns: [tag_update_column.name],
    },
  },
});

export const UPDATE_POST = gql`
  mutation UpdatePost(
    $post_id: Int!
    $title: String!
    $content: String!
    $tags: [post_tag_insert_input!]!
  ) {
    update_post_by_pk(
      pk_columns: { id: $post_id }
      _set: { title: $title, content: $content }
    ) {
      id
    }
    delete_post_tag(where: { post_id: { _eq: $post_id } }) {
      affected_rows
    }
    insert_post_tag(objects: $tags) {
      affected_rows
    }
  }
`;
