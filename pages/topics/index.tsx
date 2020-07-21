import { useEffect, useState, Fragment } from "react";
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
import TopicCard from "components/TopicCard";
import Layout from "components/Layout";
import { GetTopics, GetUser, GetUserVariables } from "apis/types";
import { GET_TOPICS } from "apis/topic";
import { initializeApollo } from "apis/client";
import useUserId from "lib/useUserId";
import { GET_USER } from "apis/user";
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

const TopicPage: React.FC = () => {
  const classes = useStyles();

  const userId = useUserId();

  const { data: userData } = useQuery<GetUser, GetUserVariables>(GET_USER, {
    variables: {
      id: userId!,
    },
    skip: !userId,
  });

  const { loading, error, data } = useQuery<GetTopics>(GET_TOPICS, {
    pollInterval: 1 * 60 * 1000,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error) {
      setMessage("刷新失败");
    } else {
      setMessage("");
    }
  }, [error]);

  return (
    <>
      <NextSeo title="话题" />
      {loading && <LinearProgress className={classes.loading} />}
      <Layout
        page="topics"
        username={userData?.user_by_pk?.username}
        userAvatarUrl={userData?.user_by_pk?.avatar_url}
      >
        {data?.category && (
          <Grid
            className={classes.root}
            container
            component={Container}
            direction="column"
            maxWidth="md"
          >
            {data!.category.map((category) => (
              <Fragment key={category.id}>
                <Typography
                  variant="h5"
                  gutterBottom
                  className={classes.subtitle}
                >
                  {category.name}
                </Typography>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid container item justify="flex-start" spacing={2}>
                    {category.topics.map((topic) => (
                      <Grid key={topic.id} item xs={12} sm={6}>
                        <Link
                          href="/topics/[topicId]"
                          as={`/topics/${topic.id}`}
                        >
                          <a>
                            <TopicCard {...topic} />
                          </a>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        )}
        <Snackbar
          open={message ? true : false}
          onClose={() => setMessage("")}
          message={<span>{message}</span>}
        />
      </Layout>
      <FloatingActions />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    await apolloClient.query<GetTopics>({
      query: GET_TOPICS,
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

export default TopicPage;
