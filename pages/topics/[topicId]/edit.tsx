import React, { useEffect, useState, useCallback } from "react";
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
import Editor from "components/Editor";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Node } from "slate";
import {
  AddPost,
  AddPostVariables,
  GetTopicById,
  GetTopicByIdVariables,
  GetTopicById_topic_by_pk,
} from "apis/types";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "apis/post";
import { GetServerSideProps } from "next";
import { initializeApollo } from "apis/client";
import { GET_TOPIC_BY_ID } from "apis/topic";
import useUserId from "lib/useUserId";
import Link from "next/link";

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

  const [title, setTitle] = useState("");
  const [value, setValue] = useState<Node[]>([]);

  const [addPost, { loading, error }] = useMutation<AddPost, AddPostVariables>(
    ADD_POST
  );

  useEffect(() => {
    if (error) {
      setMessage("帖子发布失败");
    }
  }, [error]);

  const handlePost = async () => {
    if (!title) {
      setMessage("请输入标题");
      return;
    }

    if (!value) {
      setMessage("请输入内容");
      return;
    }

    const post = await addPost({
      variables: {
        author_id: authorId!,
        topic_id: topic!.id,
        title,
        content: JSON.stringify(value),
      },
    });

    if (post && !error) {
      setMessage("发表成功！");
      setTimeout(() => {
        window.removeEventListener("beforeunload", listener);
        router.push(
          "/topics/[topicId]/posts/[postId]",
          `/topics/${topic!.id}/posts/${post.data!.insert_post_one?.id}`
        );
      }, 1000);
    }
  };

  const listener = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", listener);
    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, []);

  const [message, setMessage] = useState("");

  return (
    <div className={classes.root}>
      <NextSeo title={`#${topic!.name} - 编辑`} />
      {loading && <LinearProgress className={classes.loading} />}
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
          <Button color="primary" onClick={handlePost}>
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
      <Editor className={classes.editor} onChange={setValue} />
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
