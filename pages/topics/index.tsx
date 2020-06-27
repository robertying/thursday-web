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
import { useQuery } from "@apollo/client";
import TopicCard from "components/TopicCard";
import Layout from "components/Layout";
import { GetTopics } from "apis/types";
import { GET_TOPICS } from "apis/topic";
import { initializeApollo } from "apis/client";
import { useEffect, useState } from "react";
import useUserSession from "lib/useUserSession";

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
  })
);

const TopicPage = () => {
  const classes = useStyles();

  useUserSession();

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
      {loading && <LinearProgress />}
      <Layout page="topics">
        <Grid
          className={classes.root}
          container
          component={Container}
          direction="column"
          maxWidth="md"
        >
          <Typography variant="h5" gutterBottom className={classes.subtitle}>
            综合讨论
          </Typography>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid container item justify="flex-start" spacing={2}>
              {data?.topic.map((topic) => (
                <Grid key={topic.id} item xs={6}>
                  <Link href="/topics/[topicId]" as={`/topics/${topic.id}`}>
                    <a>
                      <TopicCard {...topic} />
                    </a>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={message ? true : false}
          onClose={() => setMessage("")}
          message={<span>{message}</span>}
        />
      </Layout>
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

export default TopicPage;
