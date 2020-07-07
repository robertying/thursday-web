import React from "react";
import { Grid, Typography, Container, Avatar } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useQuery } from "@apollo/client";
import Layout from "components/Layout";
import { initializeApollo } from "apis/client";
import { GetUserProfile, GetUserProfileVariables } from "apis/types";
import { GET_USER_PROFILE } from "apis/user";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
    },
    toolbar: theme.mixins.toolbar,
    subtitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
    },
    large: {
      width: theme.spacing(24),
      height: theme.spacing(24),
    },
    date: {
      display: "block",
      marginTop: theme.spacing(2),
      fontStyle: "italic",
    },
  })
);

const ProfilePage: React.FC = () => {
  const classes = useStyles();

  const router = useRouter();
  const { username } = router.query;

  const { data: userData } = useQuery<GetUserProfile, GetUserProfileVariables>(
    GET_USER_PROFILE,
    {
      variables: {
        username: username as string,
      },
    }
  );

  const user = userData?.user?.[0]!;

  return (
    <Layout page="others">
      <NextSeo title={user.username} />
      <Grid
        className={classes.root}
        container
        component={Container}
        direction="column"
        maxWidth="md"
      >
        <Avatar
          className={classes.large}
          src={user.avatar_url ?? undefined}
          alt={user.username}
        />
        <Typography variant="h3" gutterBottom className={classes.subtitle}>
          {user.username}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {user.status}
        </Typography>
        <Typography variant="caption" gutterBottom className={classes.date}>
          于 {dayjs(user.created_at).fromNow()} 加入
        </Typography>
        <Typography variant="h5" gutterBottom className={classes.subtitle}>
          活动
        </Typography>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, ctx);

  try {
    await apolloClient.query<GetUserProfile, GetUserProfileVariables>({
      query: GET_USER_PROFILE,
      variables: {
        username: ctx.params!.username as string,
      },
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

export default ProfilePage;
