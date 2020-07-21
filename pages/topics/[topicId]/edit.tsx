import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  InputBase,
  Divider,
  Snackbar,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Node } from "slate";
import { useMutation } from "@apollo/client";
import Editor from "components/Editor";
import {
  AddPost,
  AddPostVariables,
  GetTopicById,
  GetTopicByIdVariables,
  GetTopicById_topic_by_pk,
  GetPost_post,
  UpdatePost,
  UpdatePostVariables,
} from "apis/types";
import { ADD_POST, UPDATE_POST } from "apis/post";
import { initializeApollo } from "apis/client";
import { GET_TOPIC_BY_ID } from "apis/topic";
import useUserId from "lib/useUserId";
import {
  getNodes,
  serialize,
  isEmpty,
  deserialize,
  getPlainText,
  getEmptyValue,
} from "lib/slatejs";
import { isMobile } from "lib/platform";
import useBeforeReload from "lib/useBeforeReload";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    appBar: {
      backgroundColor: "white",
      color: "black",
      position: "relative",
    },
    toolbar: {
      "& > *": {
        margin: `auto ${theme.spacing(1)}px`,
      },
    },
    input: {
      margin: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      fontSize: 18,
    },
    editor: {
      height: "calc(100vh - 64px - 72px - 1px)",
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

export interface EditPageProps {
  topic?: GetTopicById_topic_by_pk | null;
}

const EditPage: React.FC<EditPageProps> = ({ topic }) => {
  const classes = useStyles();

  const router = useRouter();
  const post = router.query.post
    ? (JSON.parse(router.query.post as string) as GetPost_post)
    : null;

  useEffect(() => {
    if (!topic) {
      router.push({
        pathname: "/login",
        query: {
          redirect_url: window.location.pathname,
        },
      });
    }
  }, []);

  const authorId = useUserId();

  const [title, setTitle] = useState(post?.title ?? "");
  const [value, setValue] = useState<Node[]>(
    post?.content ? deserialize(post?.content) : getEmptyValue()
  );
  const [plainValue, setPlainValue] = useState(
    post?.content ? getPlainText(deserialize(post?.content)) : ""
  );

  const [
    addPost,
    { loading: addPostLoading, error: addPostError },
  ] = useMutation<AddPost, AddPostVariables>(ADD_POST);
  const [
    updatePost,
    { loading: updatePostLoading, error: updatePostError },
  ] = useMutation<UpdatePost, UpdatePostVariables>(UPDATE_POST);

  useEffect(() => {
    if (addPostError) {
      setMessage("帖子发布失败");
    }
  }, [addPostError]);

  useEffect(() => {
    if (updatePostError) {
      setMessage("帖子更新失败");
    }
  }, [updatePostError]);

  const handlePost = async () => {
    if (!title) {
      setMessage("请输入标题");
      return;
    }

    let v: string | null = null;
    if (isMobile()) {
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

    if (post) {
      const p = await updatePost({
        variables: {
          post_id: post.id,
          title,
          content: v,
        },
      });
      setMessage("编辑成功！");
      setTimeout(() => {
        router.push(
          "/topics/[topicId]/posts/[postId]",
          `/topics/${topic!.id}/posts/${p.data!.update_post_by_pk?.id}`
        );
      }, 1000);
    } else {
      const p = await addPost({
        variables: {
          author_id: authorId!,
          topic_id: topic!.id,
          title,
          content: v,
        },
      });
      setMessage("发表成功！");
      setTimeout(() => {
        router.push(
          "/topics/[topicId]/posts/[postId]",
          `/topics/${topic!.id}/posts/${p.data!.insert_post_one?.id}`
        );
      }, 1000);
    }
  };

  const [message, setMessage] = useState("");

  useBeforeReload(true);

  return (
    <div className={classes.root}>
      <NextSeo title={`#${topic!.name} - 编辑`} />
      {(addPostLoading || updatePostLoading) && (
        <LinearProgress className={classes.loading} />
      )}
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Link href="/topics/[topicId]" as={`/topics/${topic?.id}`}>
            <a>
              <IconButton edge="start" color="inherit">
                <Close />
              </IconButton>
            </a>
          </Link>
          <Typography variant="h6" style={{ flex: 1 }}>
            #{topic!.name}
          </Typography>
          <Button
            color="primary"
            onClick={handlePost}
            disabled={addPostLoading || updatePostLoading}
          >
            发布
          </Button>
        </Toolbar>
      </AppBar>
      <InputBase
        className={classes.input}
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Divider />
      <Editor
        className={classes.editor}
        value={value}
        plainTextValue={plainValue}
        onChange={setValue}
        onPlainTextChange={setPlainValue}
      />
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (
  ctx
) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    const response = await apolloClient.query<
      GetTopicById,
      GetTopicByIdVariables
    >({
      query: GET_TOPIC_BY_ID,
      variables: { id: parseInt(ctx.params!.topicId as string, 10) },
    });
    return {
      props: {
        topic: response.data?.topic_by_pk,
      },
    };
  } catch (e) {
    const { res } = ctx;
    res.writeHead(303, "Unauthorized", {
      Location: `/login?redirect_url=${ctx.req.url}`,
    });
    res.end();
  }

  return {
    props: {},
  };
};

export default EditPage;
