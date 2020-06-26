import { Grid, Container, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import TopicCard from "components/TopicCard";
import Layout from "components/Layout";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GetTopics } from "apis/types";
import { GET_TOPICS } from "apis/topic";
import { GetServerSideProps } from "next";
import { initializeApollo } from "apis/client";
import { useRouter } from "next/router";
import useUserSession from "lib/useUserSession";
import { useEffect } from "react";

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

  const router = useRouter();

  const { loading, error, data } = useQuery<GetTopics>(GET_TOPICS);

  return (
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
                <Link href={`/topics/${topic.id}`}>
                  <a>
                    <TopicCard {...topic} />
                  </a>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom className={classes.subtitle}>
          站务管理
        </Typography>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid container item justify="center" spacing={2}>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
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

export default TopicPage;
