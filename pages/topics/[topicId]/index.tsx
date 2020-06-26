import React from "react";
import { Container, Grid } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import PostCard from "components/PostCard";
import FloatingActions from "components/FloatingActions";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GetTopicPosts, GetTopicPostsVariables } from "apis/types";
import { GET_TOPIC_POSTS } from "apis/topic_post";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { initializeApollo } from "apis/client";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  })
);

const TopicPostPage: React.FC = (props) => {
  const classes = useStyles();

  const router = useRouter();
  const { topicId } = router.query;

  const { data } = useQuery<GetTopicPosts, GetTopicPostsVariables>(
    GET_TOPIC_POSTS,
    { variables: { id: parseInt(topicId as string, 10) } }
  );

  return (
    <Layout page="topic-posts" title={`#${data?.topic?.[0].name}`}>
      <Grid
        className={classes.root}
        container
        component={Container as any}
        maxWidth="md"
        direction="column"
        spacing={2}
      >
        {data?.topic?.[0].posts.map((post) => (
          <Grid item key={post.id}>
            <Link href={`/topics/${topicId}/posts/${post.id}`}>
              <a>
                <PostCard {...post} />
              </a>
            </Link>
          </Grid>
        ))}
      </Grid>
      <FloatingActions edit />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    await apolloClient.query<GetTopicPosts, GetTopicPostsVariables>({
      query: GET_TOPIC_POSTS,
      variables: { id: parseInt(ctx.params!.topicId as string, 10) },
    });
  } catch (e) {
    const { res } = ctx;
    res.setHeader("location", "/login");
    res.statusCode = 303;
    res.end();
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default TopicPostPage;
