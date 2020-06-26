import Link from "next/link";
import { Grid, Container, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import PostCard from "components/PostCard";
import Layout from "components/Layout";
import { useEffect } from "react";
import useUserSession from "lib/useUserSession";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
    },
    toolbar: theme.mixins.toolbar,
    subtitle: {
      marginTop: theme.spacing(6),
    },
  })
);

const HomePage = () => {
  const classes = useStyles();

  const router = useRouter();

  const { session } = useUserSession();

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session]);

  return (
    <Layout page="">
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
            <Grid item xs>
              <Link href="/topics/1/posts/1">
                <a>{/* <PostCard /> */}</a>
              </Link>
            </Grid>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
          </Grid>
          <Grid container item justify="center" spacing={2}>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom className={classes.subtitle}>
          最新
        </Typography>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid container item justify="center" spacing={2}>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
          </Grid>
          <Grid container item justify="center" spacing={2}>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
            <Grid item xs>
              {/* <PostCard /> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;
