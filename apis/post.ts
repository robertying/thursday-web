import { gql } from "@apollo/client";

export const GET_POST = gql`
  query GetPost($id: Int!) {
    post(
      where: { id: { _eq: $id } }
      distinct_on: topic_id
      order_by: { topic_id: asc, revision: desc }
    ) {
      id
      revision
      title
      content
      author {
        id
        username
        avatar_url
      }
      topic {
        name
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
        revision: 0
        topic_id: $topic_id
      }
    ) {
      id
    }
  }
`;
