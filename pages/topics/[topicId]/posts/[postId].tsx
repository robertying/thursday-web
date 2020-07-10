import React, { useState, useEffect } from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  DialogActions,
  Snackbar,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "@material-ui/icons";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Node } from "slate";
import Post from "components/Post";
import Comment from "components/Comment";
import Layout from "components/Layout";
import FloatingActions from "components/FloatingActions";
import ReplyCard from "components/ReplyCard";
import Editor from "components/Editor";
import {
  GetPost,
  GetPostVariables,
  emoji_reaction_enum,
  DeleteReactionVariables,
  DeleteReaction,
  AddComment,
  AddCommentVariables,
  GetUser,
  GetUserVariables,
  AddReply,
  AddReplyVariables,
  GetReplies,
  GetRepliesVariables,
} from "apis/types";
import { initializeApollo } from "apis/client";
import { GET_POST } from "apis/post";
import { ADD_REACTION, DELETE_REACTION } from "apis/reaction";
import { AddReaction, AddReactionVariables } from "apis/types";
import useUserId from "lib/useUserId";
import { ADD_COMMENT } from "apis/comment";
import { serialize, getNodes, isEmpty } from "lib/slatejs";
import { GET_USER } from "apis/user";
import { isMobile } from "lib/platform";
import Avatar from "components/Avatar";
import { ADD_REPLY, GET_REPLIES } from "apis/reply";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down("sm")]: {
        padding: 0,
      },
      margin: "auto",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      width: "100%",
      display: "block",
    },
    commentDialog: {
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    dialogContent: {
      height: "100%",
    },
    dialogContentLoading: {
      textAlign: "center",
    },
  })
);

const PostPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const { postId, topicId } = router.query;

  const userId = useUserId();

  const { data: userData } = useQuery<GetUser, GetUserVariables>(GET_USER, {
    variables: {
      id: userId!,
    },
    skip: !userId,
  });

  const { data, refetch } = useQuery<GetPost, GetPostVariables>(GET_POST, {
    variables: {
      id: parseInt(postId as string, 10),
    },
  });
  const post = data?.post?.[0];

  const [addReaction] = useMutation<AddReaction, AddReactionVariables>(
    ADD_REACTION
  );
  const [deleteReaction] = useMutation<DeleteReaction, DeleteReactionVariables>(
    DELETE_REACTION
  );

  const handleReactPost = async (id: number, reaction: emoji_reaction_enum) => {
    if (!userId) {
      return;
    }

    try {
      await addReaction({
        variables: {
          id: `${userId}-post-${postId}-${reaction}`,
          post_id: id,
          user_id: userId,
          reaction,
        },
      });
    } catch (e) {
      if (e.message.includes("Uniqueness violation")) {
        await deleteReaction({
          variables: {
            id: `${userId}-post-${postId}-${reaction}`,
          },
        });
      }
    }

    refetch();
  };

  const handleReactComment = async (
    id: number,
    reaction: emoji_reaction_enum
  ) => {
    if (!userId) {
      return;
    }

    try {
      await addReaction({
        variables: {
          id: `${userId}-comment-${id}-${reaction}`,
          comment_id: id,
          user_id: userId,
          reaction,
        },
      });
    } catch (e) {
      if (e.message.includes("Uniqueness violation")) {
        await deleteReaction({
          variables: {
            id: `${userId}-comment-${id}-${reaction}`,
          },
        });
      }
    }

    refetch();
  };

  const [replyModalVisible, setReplyModalVisible] = useState(false);

  const handleReplyModalClose = () => {
    setReplyModalVisible(false);
    setCommentId(null);
  };

  const [commentEditDialogOpen, setCommentEditDialogOpen] = useState(false);
  const [commentValue, setCommentValue] = useState<Node[]>([]);
  const [commentPlainValue, setCommentPlainValue] = useState("");
  const [commentId, setCommentId] = useState<number | null>(null);

  const [
    addComment,
    {
      loading: addCommentLoading,
      error: addCommentError,
      data: addCommentData,
    },
  ] = useMutation<AddComment, AddCommentVariables>(ADD_COMMENT);
  const [
    addReply,
    { loading: addReplyLoading, error: addReplyError, data: addReplyData },
  ] = useMutation<AddReply, AddReplyVariables>(ADD_REPLY);

  useEffect(() => {
    if (addCommentData) {
      (async () => {
        setCommentEditDialogOpen(false);
        await refetch();
        router.push(
          `${router.asPath.split("#")[0]}#comment-${
            addCommentData.insert_comment_one?.id
          }`
        );
      })();
    }
  }, [addCommentData]);

  useEffect(() => {
    if (addReplyData) {
      (async () => {
        setCommentEditDialogOpen(false);
        await refetch();
        setReplyModalVisible(true);
        router.push(
          `${router.asPath.split("#")[0]}#reply-${
            addReplyData.insert_reply_one?.id
          }`
        );
      })();
    }
  }, [addReplyData]);

  useEffect(() => {
    if (addCommentError) {
      setMessage("评论发表失败");
    }
  }, [addCommentError]);

  useEffect(() => {
    if (addReplyError) {
      setMessage("评论发表失败");
    }
  }, [addReplyError]);

  const handleCommentEditClick = () => {
    setCommentEditDialogOpen(true);
  };

  const handleCommentEditClose = () => {
    setCommentEditDialogOpen(false);
    setCommentId(null);
  };

  const handleCommentEdit = async () => {
    let v: string | null = null;
    if (isMobile()) {
      if (!commentPlainValue) {
        setMessage("请输入内容");
        return;
      }
      v = serialize(getNodes(commentPlainValue));
    } else {
      if (isEmpty(commentValue)) {
        setMessage("请输入内容");
        return;
      }
      v = serialize(commentValue);
    }

    if (commentId) {
      await addReply({
        variables: {
          author_id: userId!,
          comment_id: commentId,
          content: v,
        },
      });
    } else {
      await addComment({
        variables: {
          author_id: userId!,
          post_id: parseInt(postId as string, 10),
          content: v,
        },
      });
    }
  };

  const [
    getReplies,
    { data: replyData, loading: replyLoading, error: replyError },
  ] = useLazyQuery<GetReplies, GetRepliesVariables>(GET_REPLIES, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (replyModalVisible && commentId) {
      getReplies({
        variables: {
          comment_id: commentId,
        },
      });
    }
  }, [replyModalVisible, commentId]);

  useEffect(() => {
    if (replyError) {
      setMessage("回复加载失败");
    }
  }, [replyError]);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");

  const handleShareDialogOpen = (type: "post" | "comment", id: number) => {
    if (type === "post") {
      setSharedUrl(`/topics/${topicId}/posts/${id}`);
    } else {
      setSharedUrl(`/topics/${topicId}/posts/${postId}#comment-${id}`);
    }
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleLinkCopy = async () => {
    await navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}${sharedUrl}`
    );
    setMessage("链接已复制到剪贴板");
    handleShareDialogClose();
  };

  const [message, setMessage] = useState("");

  return (
    <Layout
      page="post"
      title={`#${post?.topic.name}`}
      backHref="/topics/[topicId]"
      backAs={`/topics/${topicId}`}
      username={userData?.user_by_pk?.username}
      userAvatarUrl={userData?.user_by_pk?.avatar_url}
    >
      <NextSeo title={`#${post?.topic.name} - ${post!.title}`} />
      <Grid
        className={classes.root}
        container
        component={Container}
        direction="column"
        maxWidth="md"
        spacing={2}
      >
        <Grid item>
          <Post
            {...post!}
            onReact={handleReactPost}
            onShare={(id) => handleShareDialogOpen("post", id)}
          />
        </Grid>
        {post?.comments?.map((comment) => (
          <Grid item key={comment.id} id={`comment-${comment.id}`}>
            <Comment
              {...comment}
              onReact={handleReactComment}
              onShare={(id) => handleShareDialogOpen("comment", id)}
              onReplyButtonClick={() => {
                setCommentId(comment.id);
                setReplyModalVisible(true);
              }}
              onReply={(id) => {
                setCommentId(id);
                handleCommentEditClick();
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={replyModalVisible}
        onClose={handleReplyModalClose}
        scroll="body"
        fullWidth
      >
        <DialogTitle>回复</DialogTitle>
        <DialogContent>
          {replyLoading && (
            <div className={classes.dialogContentLoading}>
              <CircularProgress />
            </div>
          )}
          {replyData?.reply.map((reply) => (
            <ReplyCard key={reply.id} {...reply} />
          ))}
        </DialogContent>
      </Dialog>
      <FloatingActions comment onCommentClick={handleCommentEditClick} />
      <Dialog
        open={commentEditDialogOpen}
        onClose={handleCommentEditClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullScreen={fullScreen}
      >
        <DialogTitle>{commentId ? "添加回复" : "添加评论"}</DialogTitle>
        {fullScreen && (
          <DialogActions>
            <Button onClick={handleCommentEditClose} color="primary">
              取消
            </Button>
            <Button
              onClick={handleCommentEdit}
              color="primary"
              disabled={addCommentLoading || addReplyLoading}
            >
              发布
            </Button>
          </DialogActions>
        )}
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Editor
            compact
            onChange={setCommentValue}
            onPlainTextChange={setCommentPlainValue}
          />
        </DialogContent>
        {!fullScreen && (
          <DialogActions>
            <Button onClick={handleCommentEditClose} color="primary">
              取消
            </Button>
            <Button
              onClick={handleCommentEdit}
              color="primary"
              disabled={addCommentLoading || addReplyLoading}
            >
              发布
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Dialog onClose={handleShareDialogClose} open={shareDialogOpen}>
        <DialogTitle>分享</DialogTitle>
        <List>
          <ListItem button onClick={() => handleLinkCopy()}>
            <ListItemAvatar>
              <Avatar>
                <Link />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="复制链接到剪贴板" />
          </ListItem>
        </List>
      </Dialog>
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    await apolloClient.query<GetPost, GetPostVariables>({
      query: GET_POST,
      variables: { id: parseInt(ctx.params!.postId as string, 10) },
    });
  } catch (e) {
    const { res } = ctx;
    res.writeHead(303, "Unauthorized", {
      Location: `/login?redirect_url=${ctx.req.url}`,
    });
    res.end();
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default PostPage;
