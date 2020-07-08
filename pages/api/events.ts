import { NextApiRequest, NextApiResponse } from "next";

const url = `${process.env.API_URL}/v1/graphql`;
const GET_POST_AUTHOR = `
    query GetPostAuthor($post_id:Int!) {
        post_by_pk(id: $post_id) {
            author_id
        }
    }
`;
const GET_COMMENT_AUTHOR = `
    query GetCommentAuthor($comment_id:Int!) {
        comment_by_pk(id: $comment_id) {
            author_id
        }
    }
`;
const ADD_ACTIVITY = `
    mutation AddActivity($id: String!, $comment_id: Int,  $reply_id: Int, $user_id: uuid!) {
        insert_activity_one(object: {id: $id, user_id: $user_id, reply_id: $reply_id, comment_id: $comment_id}) {
            id
        }
    }
`;

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async (resolve) => {
    const secret = req.headers["x-hasura-event-secret"];
    if (!secret || secret !== process.env.HASURA_GRAPHQL_EVENT_SECRET) {
      res.status(401).send("401 Unauthorized: request forbidden");
      return resolve();
    }

    const data = req.body?.event?.data?.new;
    if (!data) {
      res.status(500).end();
      return resolve();
    }

    const type = req.body?.table?.name;

    if (type === "comment") {
      try {
        const authorReq = {
          query: GET_POST_AUTHOR,
          variables: {
            post_id: data.post_id,
          },
        };
        let response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(authorReq),
        });

        let json = await response.json();
        const user_id = json?.data?.post_by_pk?.author_id;

        const graphqlReq = {
          query: ADD_ACTIVITY,
          variables: {
            id: `${user_id}-comment-${data.id}`,
            comment_id: data.id,
            user_id,
          },
        };
        response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(graphqlReq),
        });

        json = await response.json();
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }
        res.status(200).end();
        return resolve();
      } catch (e) {
        console.error(e);
        res.status(500).end();
        return resolve();
      }
    } else if (type === "reply") {
      try {
        const authorReq = {
          query: GET_COMMENT_AUTHOR,
          variables: {
            comment_id: data.comment_id,
          },
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(authorReq),
        });

        let json = await response.json();
        const user_id = json?.data?.comment_by_pk?.author_id;

        const graphqlReq = {
          query: ADD_ACTIVITY,
          variables: {
            id: `${user_id}-reply-${data.id}`,
            reply_id: data.id,
            user_id,
          },
        };
        await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(graphqlReq),
        });

        json = await response.json();
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }
        res.status(200).end();
        return resolve();
      } catch (e) {
        console.error(e);
        res.status(500).end();
        return resolve();
      }
    } else {
      res.status(422).send("422 Unprocessable Entity: Unsupported event type");
      return resolve();
    }
  });
};
