import { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";

webpush.setVapidDetails(
  "https://thu.community",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const url = `${process.env.API_URL}/v1/graphql`;

const GET_COMMENT = `
  query GetComment($comment_id: Int!) {
    comment_by_pk(id: $comment_id) {
      author {
        id
        username
      }
      post {
        title
        topic_id
        id
        author {
          id
          web_push_subscription
        }
      }
    }
  }
`;
const GET_REPLY = `
  query GetReply($reply_id: Int!) {
    reply_by_pk(id: $reply_id) {
      author {
        id
        username
      }
      comment {
        id
        author {
          id
          web_push_subscription
        }
        post {
          title
          topic_id
          id
        }
      }
    }
  }
`;
const ADD_ACTIVITY = `
  mutation AddActivity(
    $id: String!
    $comment_id: Int
    $reply_id: Int
    $user_id: uuid!
  ) {
    insert_activity_one(
      object: {
        id: $id
        user_id: $user_id
        reply_id: $reply_id
        comment_id: $comment_id
      }
    ) {
      id
    }
  }
`;
const ADD_POST_HISTORY = `
  mutation AddPostHistory(
    $post_id: Int!
    $revision: Int!
    $old_content: String!
  ) {
    insert_post_history_one(
      object: { post_id: $post_id, revision: $revision, content: $old_content }
    ) {
      post_id
    }
    update_post_by_pk(pk_columns: { id: $post_id }, _inc: { revision: 1 }) {
      revision
    }
  }
`;
const ADD_COMMENT_HISTORY = `
  mutation AddCommentHistory(
    $comment_id: Int!
    $revision: Int!
    $old_content: String!
  ) {
    insert_comment_history_one(
      object: {
        comment_id: $comment_id
        revision: $revision
        content: $old_content
      }
    ) {
      comment_id
    }
    update_comment_by_pk(
      pk_columns: { id: $comment_id }
      _inc: { revision: 1 }
    ) {
      revision
    }
  }
`;
const ADD_REPLY_HISTORY = `
  mutation AddReplyHistory(
    $reply_id: Int!
    $revision: Int!
    $old_content: String!
  ) {
    insert_reply_history_one(
      object: {
        reply_id: $reply_id
        revision: $revision
        content: $old_content
      }
    ) {
      reply_id
    }
    update_reply_by_pk(pk_columns: { id: $reply_id }, _inc: { revision: 1 }) {
      revision
    }
  }
`;

const sendWebPush = async (
  subscription: string,
  payload: {
    title: string;
    content: string;
    url: string;
  }
) => {
  try {
    if (!subscription) {
      return;
    }
    await webpush.sendNotification(
      JSON.parse(subscription) as webpush.PushSubscription,
      JSON.stringify(payload)
    );
  } catch (e) {
    console.error(e);
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async (resolve) => {
    const secret = req.headers["x-hasura-event-secret"];
    if (!secret || secret !== process.env.HASURA_GRAPHQL_EVENT_SECRET) {
      res.status(401).send("401 Unauthorized: request forbidden");
      return resolve();
    }

    const data = req.body?.event?.data?.new;
    const old = req.body?.event?.data?.old;
    if (!data) {
      res.status(500).end();
      return resolve();
    }

    const type = req.body?.trigger?.name;

    if (type === "add_comment_activity") {
      try {
        const commentReq = {
          query: GET_COMMENT,
          variables: {
            comment_id: data.id,
          },
        };
        let response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(commentReq),
        });

        let json = await response.json();
        const comment = json?.data?.comment_by_pk;

        if (comment.author.id === comment.post.author.id) {
          res.status(200).end();
          return resolve();
        }

        const graphqlReq = {
          query: ADD_ACTIVITY,
          variables: {
            id: `${comment.post.author.id}-comment-${data.id}`,
            comment_id: data.id,
            user_id: comment.post.author.id,
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

        await sendWebPush(comment.post.author.web_push_subscription, {
          title: "你收到了一条新评论",
          content: `${comment.author.username} 评论了你的帖子 ${comment.post.title}`,
          url: `/topics/${comment.post.topic_id}/posts/${comment.post.id}#comment-${data.id}`,
        });

        res.status(200).end();
        return resolve();
      } catch (e) {
        console.error(e);
        res.status(500).end();
        return resolve();
      }
    } else if (type === "add_reply_activity") {
      try {
        const replyReq = {
          query: GET_REPLY,
          variables: {
            reply_id: data.id,
          },
        };
        let response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(replyReq),
        });

        let json = await response.json();
        const reply = json?.data?.reply_by_pk;

        if (reply.author.id === reply.comment.author.id) {
          res.status(200).end();
          return resolve();
        }

        const graphqlReq = {
          query: ADD_ACTIVITY,
          variables: {
            id: `${reply.comment.author.id}-reply-${data.id}`,
            reply_id: data.id,
            user_id: reply.comment.author.id,
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

        await sendWebPush(reply.comment.author.web_push_subscription, {
          title: "你收到了一条新回复",
          content: `${reply.author.username} 回复了你在帖子 ${reply.comment.post.title} 中的评论`,
          url: `/topics/${reply.comment.post.topic_id}/posts/${reply.comment.post.id}#comment-${reply.comment.id}?reply-${data.id}`,
        });

        res.status(200).end();
        return resolve();
      } catch (e) {
        console.error(e);
        res.status(500).end();
        return resolve();
      }
    } else if (type === "add_post_history") {
      try {
        const graphqlReq = {
          query: ADD_POST_HISTORY,
          variables: {
            post_id: old.id,
            revision: old.revision,
            old_content: old.content,
          },
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(graphqlReq),
        });

        const json = await response.json();
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
    } else if (type === "add_comment_history") {
      try {
        const graphqlReq = {
          query: ADD_COMMENT_HISTORY,
          variables: {
            comment_id: old.id,
            revision: old.revision,
            old_content: old.content,
          },
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(graphqlReq),
        });

        const json = await response.json();
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
    } else if (type === "add_reply_history") {
      try {
        const graphqlReq = {
          query: ADD_REPLY_HISTORY,
          variables: {
            reply_id: old.id,
            revision: old.revision,
            old_content: old.content,
          },
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
          },
          body: JSON.stringify(graphqlReq),
        });

        const json = await response.json();
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
