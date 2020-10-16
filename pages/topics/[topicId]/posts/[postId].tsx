import React, { useState, useEffect, useCallback } from "react";
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
  LinearProgress,
  DialogContentText,
} from "@material-ui/core";
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "@material-ui/icons";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Editor, Node } from "slate";
import Post from "components/Post";
import Comment from "components/Comment";
import Layout from "components/Layout";
import FloatingActions from "components/FloatingActions";
import Reply from "components/Reply";
import MyEditor from "components/Editor";
import Avatar from "components/Avatar";
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
  UpdateComment,
  UpdateCommentVariables,
  UpdateReply,
  UpdateReplyVariables,
} from "apis/types";
import { initializeApollo } from "apis/client";
import { GET_POST } from "apis/post";
import { ADD_REACTION, DELETE_REACTION } from "apis/reaction";
import { AddReaction, AddReactionVariables } from "apis/types";
import { ADD_COMMENT, UPDATE_COMMENT } from "apis/comment";
import { GET_USER } from "apis/user";
import { ADD_REPLY, GET_REPLIES, UPDATE_REPLY } from "apis/reply";
import {
  serialize,
  getNodes,
  isEmpty,
  deserialize,
  getPlainText,
  getEmptyValue,
  resetSelection,
} from "lib/slatejs";
import useUserId from "lib/useUserId";
import { isDesktopSafari, isMobile } from "lib/platform";
import useBeforeReload from "lib/useBeforeReload";
import { isLearnXUser } from "lib/learnx";
import { getUserId, getUserSession } from "apis/cognito";

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
    loading: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1199,
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

  /**
   * reaction
   */
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
      if (e.message.includes('field "insert_reaction_one" not found')) {
        setMessage("你无法这么做，请注册正式账号");
        return;
      }
    }

    await refetch();
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
      if (e.message.includes('field "insert_reaction_one" not found')) {
        setMessage("你无法这么做，请注册正式账号");
        return;
      }
    }

    await refetch();
  };

  const [editor, setEditor] = useState<Editor | null>(null);

  const handleEditClose = useCallback(() => {
    setEditDialogOpen(false);
    setEditingCommentId(null);
    setEditingReplyId(null);
    setReplyToCommentId(null);
    editor && resetSelection(editor);
    setValue(getEmptyValue());
    setPlainValue("");
  }, [editor]);

  /**
   * comment
   */
  const [
    addComment,
    {
      loading: addCommentLoading,
      error: addCommentError,
      data: addCommentData,
    },
  ] = useMutation<AddComment, AddCommentVariables>(ADD_COMMENT);
  const [
    updateComment,
    {
      loading: updateCommentLoading,
      error: updateCommentError,
      data: updateCommentData,
    },
  ] = useMutation<UpdateComment, UpdateCommentVariables>(UPDATE_COMMENT);

  useEffect(() => {
    if (addCommentData) {
      (async () => {
        handleEditClose();
        await refetch();
        router.push(
          `${router.asPath.split("#")[0]}#comment-${
            addCommentData.insert_comment_one?.id
          }`
        );
      })();
    }
  }, [addCommentData, handleEditClose, refetch, router]);

  useEffect(() => {
    if (updateCommentData) {
      (async () => {
        handleEditClose();
        await refetch();
        router.push(
          `${router.asPath.split("#")[0]}#comment-${
            updateCommentData.update_comment_by_pk?.id
          }`
        );
      })();
    }
  }, [handleEditClose, refetch, router, updateCommentData]);

  useEffect(() => {
    if (addCommentError) {
      setMessage("评论发表失败");
    }
  }, [addCommentError]);

  useEffect(() => {
    if (updateCommentError) {
      setMessage("评论编辑失败");
    }
  }, [updateCommentError]);

  /**
   * reply
   */
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [
    getReplies,
    { data: replyData, loading: replyLoading, error: replyError },
  ] = useLazyQuery<GetReplies, GetRepliesVariables>(GET_REPLIES, {
    fetchPolicy: "network-only",
  });
  const [
    addReply,
    { loading: addReplyLoading, error: addReplyError, data: addReplyData },
  ] = useMutation<AddReply, AddReplyVariables>(ADD_REPLY);
  const [
    updateReply,
    {
      loading: updateReplyLoading,
      error: updateReplyError,
      data: updateReplyData,
    },
  ] = useMutation<UpdateReply, UpdateReplyVariables>(UPDATE_REPLY);

  const handleReplyModalOpen = () => {
    setReplyModalVisible(true);
  };
  const handleReplyModalClose = () => {
    setReplyModalVisible(false);
    setReplyToCommentId(null);
  };

  useEffect(() => {
    if (replyModalVisible && replyToCommentId) {
      getReplies({
        variables: {
          comment_id: replyToCommentId,
        },
      });
    }
  }, [getReplies, replyModalVisible, replyToCommentId]);

  useEffect(() => {
    if (addReplyData) {
      (async () => {
        handleEditClose();
        await refetch();
        setReplyModalVisible(true);
        router.push(
          `${router.asPath.split("#")[0]}#reply-${
            addReplyData.insert_reply_one?.id
          }`
        );
      })();
    }
  }, [addReplyData, handleEditClose, refetch, router]);

  useEffect(() => {
    if (updateReplyData) {
      (async () => {
        handleEditClose();
        await refetch();
        setReplyModalVisible(true);
        router.push(
          `${router.asPath.split("#")[0]}#reply-${
            updateReplyData.update_reply_by_pk?.id
          }`
        );
      })();
    }
  }, [handleEditClose, refetch, router, updateReplyData]);

  useEffect(() => {
    if (addReplyError) {
      setMessage("回复发表失败");
    }
  }, [addReplyError]);

  useEffect(() => {
    if (updateReplyError) {
      setMessage("回复编辑失败");
    }
  }, [updateReplyError]);

  useEffect(() => {
    if (replyError) {
      setMessage("回复加载失败");
    }
  }, [replyError]);

  /**
   * edit
   */
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [value, setValue] = useState<Node[]>(getEmptyValue());
  const [plainValue, setPlainValue] = useState("");

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEdit = async () => {
    let v: string | null = null;
    if (isMobile() || isDesktopSafari()) {
      if (!plainValue) {
        setMessage("请输入内容");
        return;
      }
      v = serialize(getNodes(plainValue));
    } else {
      if (isEmpty(value)) {
        setMessage("请输入内容");
        return;
      }
      v = serialize(value);
    }

    if (editingReplyId) {
      await updateReply({
        variables: {
          reply_id: editingReplyId,
          content: v,
        },
      });
    } else if (replyToCommentId) {
      await addReply({
        variables: {
          author_id: userId!,
          comment_id: replyToCommentId,
          content: v,
        },
      });
    } else if (editingCommentId) {
      await updateComment({
        variables: {
          comment_id: editingCommentId,
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

  const handlePostEdit = () => {
    router.push(
      {
        pathname: "/topics/[topicId]/edit",
        query: { post: JSON.stringify(post) },
      },
      `/topics/${topicId}/edit`
    );
  };

  /**
   * share
   */
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

  /**
   * snackbar
   */
  const [message, setMessage] = useState("");

  useBeforeReload(editDialogOpen);

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
      {(addCommentLoading ||
        addReplyLoading ||
        updateCommentLoading ||
        updateReplyLoading) && <LinearProgress className={classes.loading} />}
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
            onEdit={
              post?.author.username === userData?.user_by_pk?.username &&
              !isLearnXUser(userId)
                ? handlePostEdit
                : undefined
            }
            onShare={(id) => handleShareDialogOpen("post", id)}
          />
        </Grid>
        {post?.comments?.map((comment) => (
          <Grid item key={comment.id} id={`comment-${comment.id}`}>
            <Comment
              {...comment}
              onReact={handleReactComment}
              onEdit={
                comment.author.username === userData?.user_by_pk?.username &&
                !isLearnXUser(userId)
                  ? () => {
                      setValue(deserialize(comment.content));
                      setPlainValue(getPlainText(deserialize(comment.content)));
                      setEditingCommentId(comment.id);
                      handleEditClick();
                    }
                  : undefined
              }
              onShare={(id) => handleShareDialogOpen("comment", id)}
              onReplyButtonClick={() => {
                setReplyToCommentId(comment.id);
                handleReplyModalOpen();
              }}
              onReply={() => {
                setReplyToCommentId(comment.id);
                handleEditClick();
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
            <Reply
              key={reply.id}
              {...reply}
              onEdit={
                reply.author.username === userData?.user_by_pk?.username &&
                !isLearnXUser(userId)
                  ? () => {
                      setValue(deserialize(reply.content));
                      setPlainValue(getPlainText(deserialize(reply.content)));
                      setEditingReplyId(reply.id);
                      setReplyModalVisible(false);
                      handleEditClick();
                    }
                  : undefined
              }
            />
          ))}
        </DialogContent>
      </Dialog>
      <FloatingActions comment onCommentClick={handleEditClick} />
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullScreen={fullScreen}
      >
        <DialogTitle>
          {editingCommentId
            ? "编辑评论"
            : editingReplyId
            ? "编辑回复"
            : replyToCommentId
            ? "添加回复"
            : "添加评论"}
        </DialogTitle>
        {fullScreen && (
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              取消
            </Button>
            <Button
              onClick={handleEdit}
              color="primary"
              disabled={
                addCommentLoading ||
                addReplyLoading ||
                updateCommentLoading ||
                updateReplyLoading
              }
            >
              发布
            </Button>
          </DialogActions>
        )}
        <DialogContent classes={{ root: classes.dialogContent }}>
          <DialogContentText variant="caption">
            任何人对你发布内容的使用需要依据{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
              target="_blank"
              rel="noreferrer noopener"
            >
              CC BY-NC-SA 4.0
            </a>{" "}
            知识共享许可协议进行；你也可以单独声明其他类型的许可协议。
          </DialogContentText>
          <MyEditor
            compact
            value={value}
            plainTextValue={plainValue}
            onChange={setValue}
            onPlainTextChange={setPlainValue}
            getEditor={(editor) => setEditor(editor)}
          />
        </DialogContent>
        {!fullScreen && (
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              取消
            </Button>
            <Button
              onClick={handleEdit}
              color="primary"
              disabled={
                addCommentLoading ||
                addReplyLoading ||
                updateCommentLoading ||
                updateReplyLoading
              }
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
  try {
    const { user } = await getUserSession(ctx);
    const userId = (await getUserId(user))!;

    const apolloClient = initializeApollo();

    await apolloClient.query<GetUser, GetUserVariables>({
      query: GET_USER,
      variables: {
        id: userId,
      },
    });

    const result = await apolloClient.query<GetPost, GetPostVariables>({
      query: GET_POST,
      variables: { id: parseInt(ctx.params!.postId as string, 10) },
    });
    if (result.data?.post.length === 0) {
      const { res } = ctx;
      res.writeHead(303, "Not found", {
        Location: `/404`,
      });
      res.end();
      return {
        props: {},
      };
    }

    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (e) {
    const { res } = ctx;
    res.writeHead(303, "Unauthorized", {
      Location: `/login?redirect_url=${ctx.req.url}`,
    });
    res.end();
    return {
      props: {},
    };
  }
};

export default PostPage;
