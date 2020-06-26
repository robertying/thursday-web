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
import { Node } from "slate";
import {
  GetTopics_topic,
  AddPost,
  AddPostVariables,
  GetTopicById,
  GetTopicByIdVariables,
  GetTopicById_topic_by_pk,
} from "apis/types";
import useUserSession from "lib/useUserSession";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "apis/post";
import { GetServerSideProps } from "next";
import { initializeApollo } from "apis/client";
import { getUserAttributes } from "apis/cognito";
import { GET_TOPIC_BY_ID } from "apis/topic";
import { route } from "next/dist/next-server/server/router";

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
      router.push("/login");
    }
  }, []);

  const { user } = useUserSession();
  const [authorId, setAuthorId] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      if (user) {
        const result = await getUserAttributes(user);
        setAuthorId(result.find((v) => v.getName() === "sub")?.getValue());
      }
    })();
  }, [user]);

  const handleClose = () => {
    router.back();
  };

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
        author_id: authorId,
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
      {loading && <LinearProgress />}
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
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
    res.setHeader("location", "/login");
    res.statusCode = 303;
    res.end();
  }

  return {
    props: {},
  };
};

export default EditPage;
