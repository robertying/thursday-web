import { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Typography,
  LinearProgress,
  Snackbar,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useQuery } from "@apollo/client";
import Layout from "components/Layout";
import PostCard from "components/PostCard";
import { initializeApollo } from "apis/client";
import {
  GetTopPosts,
  GetNewestPosts,
  GetUser,
  GetUserVariables,
} from "apis/types";
import { GET_NEWEST_POSTS, GET_TOP_POSTS } from "apis/home";
import { GET_USER } from "apis/user";
import useUserId from "lib/useUserId";
import FloatingActions from "components/FloatingActions";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
    },
    toolbar: theme.mixins.toolbar,
    subtitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
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

const HomePage = () => {
  const classes = useStyles();

  const userId = useUserId();

  const { data: userData } = useQuery<GetUser, GetUserVariables>(GET_USER, {
    variables: {
      id: userId!,
    },
    skip: !userId,
  });

  const {
    loading: topPostLoading,
    error: topPostError,
    data: topPostData,
  } = useQuery<GetTopPosts>(GET_TOP_POSTS, {
    pollInterval: 1 * 60 * 1000,
  });
  const {
    loading: newestPostLoading,
    error: newestPostError,
    data: newestPostData,
  } = useQuery<GetNewestPosts>(GET_NEWEST_POSTS, {
    pollInterval: 1 * 60 * 1000,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (topPostError || newestPostError) {
      setMessage("刷新失败");
    } else {
      setMessage("");
    }
  }, [topPostError, newestPostError]);

  return (
    <>
      <NextSeo title="主页" />
      {(topPostLoading || newestPostLoading) && (
        <LinearProgress className={classes.loading} />
      )}
      <Layout
        page=""
        username={userData?.user_by_pk?.username}
        userAvatarUrl={userData?.user_by_pk?.avatar_url}
      >
        <Grid
          className={classes.root}
          container
          component={Container}
          direction="column"
          maxWidth="md"
        >
          <Typography variant="h5" gutterBottom className={classes.subtitle}>
            热门
          </Typography>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid container item justify="center" spacing={2}>
              {topPostData?.post?.[0] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${topPostData?.post?.[0].topic_id}/posts/${topPostData?.post?.[0].id}`}
                  >
                    <a>
                      <PostCard {...topPostData?.post?.[0]} />
                    </a>
                  </Link>
                </Grid>
              )}
              {topPostData?.post?.[1] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${topPostData?.post?.[1].topic_id}/posts/${topPostData?.post?.[1].id}`}
                  >
                    <a>
                      <PostCard {...topPostData?.post?.[1]} />
                    </a>
                  </Link>
                </Grid>
              )}
            </Grid>
            <Grid container item justify="center" spacing={2}>
              {topPostData?.post?.[2] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${topPostData?.post?.[2].topic_id}/posts/${topPostData?.post?.[2].id}`}
                  >
                    <a>
                      <PostCard {...topPostData?.post?.[2]} />
                    </a>
                  </Link>
                </Grid>
              )}
              {topPostData?.post?.[3] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${topPostData?.post?.[3].topic_id}/posts/${topPostData?.post?.[3].id}`}
                  >
                    <a>
                      <PostCard {...topPostData?.post?.[3]} />
                    </a>
                  </Link>
                </Grid>
              )}
              {topPostData?.post?.[4] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${topPostData?.post?.[4].topic_id}/posts/${topPostData?.post?.[4].id}`}
                  >
                    <a>
                      <PostCard {...topPostData?.post?.[4]} />
                    </a>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Typography variant="h5" gutterBottom className={classes.subtitle}>
            最新
          </Typography>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid container item justify="center" spacing={2}>
              {newestPostData?.post?.[0] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${newestPostData?.post?.[0].topic_id}/posts/${newestPostData?.post?.[0].id}`}
                  >
                    <a>
                      <PostCard {...newestPostData?.post?.[0]} />
                    </a>
                  </Link>
                </Grid>
              )}
              {newestPostData?.post?.[1] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${newestPostData?.post?.[1].topic_id}/posts/${newestPostData?.post?.[1].id}`}
                  >
                    <a>
                      <PostCard {...newestPostData?.post?.[1]} />
                    </a>
                  </Link>
                </Grid>
              )}
            </Grid>
            <Grid container item justify="center" spacing={2}>
              {newestPostData?.post?.[2] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${newestPostData?.post?.[2].topic_id}/posts/${newestPostData?.post?.[2].id}`}
                  >
                    <a>
                      <PostCard {...newestPostData?.post?.[2]} />
                    </a>
                  </Link>
                </Grid>
              )}
              {newestPostData?.post?.[3] && (
                <Grid item xs>
                  <Link
                    href="/topics/[topicId]/posts/[postId]"
                    as={`/topics/${newestPostData?.post?.[3].topic_id}/posts/${newestPostData?.post?.[3].id}`}
                  >
                    <a>
                      <PostCard {...newestPostData?.post?.[3]} />
                    </a>
                  </Link>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Layout>
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
      <FloatingActions />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    await Promise.all([
      apolloClient.query<GetTopPosts>({
        query: GET_TOP_POSTS,
      }),
      apolloClient.query<GetNewestPosts>({
        query: GET_NEWEST_POSTS,
      }),
    ]);
  } catch (e) {
    const { res } = ctx;
    res.writeHead(303, "Unauthorized", {
      Location: "/login",
    });
    res.end();
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default HomePage;
