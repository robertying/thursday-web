import { useEffect, useState } from "react";

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
import ChipInput from "material-ui-chip-input";
import { GetServerSideProps } from "next";
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
import { ADD_POST, getPostTagInput, getTagInput, UPDATE_POST } from "apis/post";
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
import { isDesktopSafari, isMobile } from "lib/platform";
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
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      fontSize: 18,
    },
    license: {
      margin: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    editor: {
      height: "calc(100vh - 64px - 72px - 48px)",
    },
    loading: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1199,
    },
    chip: {
      margin: theme.spacing(0.5),
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
  const { tag } = router.query;
  const defaultTags =
    post?.post_tags.map((t) => t.tag.name) ??
    (tag ? (Array.isArray(tag) ? tag : [tag]) : []);

  useEffect(() => {
    if (!topic) {
      router.push({
        pathname: "/login",
        query: {
          redirect_url: window.location.pathname,
        },
      });
    }
  }, [router, topic]);

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

    if (post) {
      const p = await updatePost({
        variables: {
          post_id: post.id,
          title,
          content: v,
          tags: tags.map((tag) => getPostTagInput(post.id, tag)),
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
          tags: tags.map((tag) => ({ tag: getTagInput(tag) })),
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

  const [tags, setTags] = useState<string[]>(defaultTags);

  const handleAddChip = (tag: string) => {
    if (tags.length === 5) {
      setMessage("最多只能添加 5 个标签");
      return;
    }
    setTags([...tags, tag]);
  };

  const handleDeleteChip = (tag: string, index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  return (
    <div className={classes.root}>
      <NextSeo title={`#${topic!.name} - 编辑`} />
      {(addPostLoading || updatePostLoading) && (
        <LinearProgress className={classes.loading} />
      )}
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" color="inherit" onClick={router.back}>
            <Close />
          </IconButton>
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
      <Typography variant="caption" className={classes.license}>
        任何人对你发布内容的使用需要依据{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
          target="_blank"
          rel="noreferrer noopener"
        >
          CC BY-NC-SA 4.0
        </a>{" "}
        知识共享许可协议进行；你也可以单独声明其他类型的许可协议。
      </Typography>
      <Divider />
      <InputBase
        className={classes.input}
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Divider />
      <ChipInput
        className={classes.input}
        classes={{ chip: classes.chip }}
        value={tags}
        onAdd={(chip) => handleAddChip(chip)}
        onDelete={(chip, index) => handleDeleteChip(chip, index)}
        alwaysShowPlaceholder
        placeholder="添加标签"
        blurBehavior="ignore"
        disableUnderline
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
  try {
    const apolloClient = initializeApollo();

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
    return {
      props: {},
    };
  }
};

export default EditPage;
