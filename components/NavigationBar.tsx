import { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Avatar,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  useMediaQuery,
} from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  withStyles,
  useTheme,
} from "@material-ui/core/styles";
import {
  ArrowBack,
  Notifications,
  NotificationsNone,
} from "@material-ui/icons";
import Router from "next/router";
import Link from "next/link";
import { useLazyQuery } from "@apollo/client";
import { GetActivities, GetActivitiesVariables } from "apis/types";
import { GET_ACTIVITIES } from "apis/activity";
import useUserId from "lib/useUserId";
import ElevateOnScroll from "./ElevateOnScroll";

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.background.default,
      color: "black",
      top: "unset",
    },
    avatarIcon: {
      padding: 0,
    },
    avatar: {
      [theme.breakpoints.down("sm")]: {
        width: 30,
        height: 30,
      },
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: (props: { loading: boolean }) =>
        props.loading ? "center" : "stretch",
      width: 300,
      height: 300,
      overflow: "auto",
    },
    inline: {
      display: "inline",
    },
  })
);

const StyledTab = withStyles({
  root: {
    height: 64,
    fontSize: "1rem",
  },
})(Tab);

export type Page = "" | "topics" | "others" | "topic-posts" | "post";

export interface NavigationBarProps {
  title?: string;
  page: Page;
  backHref?: string;
  backAs?: string;
  username?: string;
  userAvatarUrl?: string | null;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  page,
  backAs,
  backHref,
  username,
  userAvatarUrl,
}) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleActivityClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(e.currentTarget);
  };

  const handleActivityClose = () => {
    setAnchorEl(null);
  };

  const userId = useUserId();
  const [getActivities, { data, loading }] = useLazyQuery<
    GetActivities,
    GetActivitiesVariables
  >(GET_ACTIVITIES);

  useEffect(() => {
    if (anchorEl && userId) {
      getActivities({
        variables: {
          user_id: userId!,
        },
      });
    }
  }, [anchorEl, userId]);

  const classes = useStyles({
    loading: loading || data?.activity.length === 0,
  });

  return (
    <>
      <ElevateOnScroll>
        <AppBar className={classes.appBar} color="secondary">
          <Container maxWidth="md">
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="flex-start"
              spacing={1}
            >
              {backHref && (
                <Grid item>
                  <Link href={backHref} as={backAs}>
                    <a>
                      <IconButton size={sm ? "small" : "medium"}>
                        <ArrowBack />
                      </IconButton>
                    </a>
                  </Link>
                </Grid>
              )}
              <Grid item>
                <Typography variant={sm ? "h6" : "h4"}>
                  {title ?? "星期四"}
                </Typography>
              </Grid>
              <Grid item xs>
                <Tabs
                  value={page === "" || page === "topics" ? page : false}
                  onChange={(e, value) => Router.push(`/${value}`)}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  scrollButtons="auto"
                >
                  <StyledTab label="主页" value="" />
                  <StyledTab label="话题" value="topics" />
                </Tabs>
              </Grid>
              {username && (
                <>
                  <Grid item>
                    <IconButton
                      onClick={handleActivityClick}
                      size={sm ? "small" : "medium"}
                    >
                      <Notifications />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Link href="/users/[username]" as={`/users/${username}`}>
                      <a>
                        <IconButton className={classes.avatarIcon}>
                          <Avatar
                            className={classes.avatar}
                            src={userAvatarUrl ?? undefined}
                            alt={username}
                          />
                        </IconButton>
                      </a>
                    </Link>
                  </Grid>
                </>
              )}
            </Grid>
          </Container>
        </AppBar>
      </ElevateOnScroll>
      <Popover
        classes={{ paper: classes.paper }}
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleActivityClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
      >
        {loading && <CircularProgress />}
        {!loading && data?.activity.length === 0 && (
          <>
            <NotificationsNone />
            <Typography variant="subtitle1">无活动</Typography>
          </>
        )}
        {!loading && data?.activity.length !== 0 && (
          <List>
            {data?.activity.map((activity) => (
              <ListItem key={activity.id}>
                <ListItemAvatar>
                  <Avatar
                    alt={
                      activity.comment?.author.username ??
                      activity.reply?.author.username
                    }
                    src={
                      activity.comment?.author.avatar_url ??
                      activity.reply?.author.avatar_url ??
                      undefined
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {activity.comment?.author.username ??
                          activity.reply?.author.username}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {activity.comment && (
                          <span>
                            {" "}
                            评论了你的帖子{" "}
                            <Link
                              href="/topics/[topicId]/posts/[postId]"
                              as={`/topics/${activity.comment.post?.topic_id}/posts/${activity.comment.post?.id}#comment-${activity.comment.id}`}
                            >
                              <a>{activity.comment.post?.title}</a>
                            </Link>
                          </span>
                        )}
                        {activity.reply && (
                          <span>
                            {" "}
                            回复了你在帖子{" "}
                            <Link
                              href="/topics/[topicId]/posts/[postId]"
                              as={`/topics/${activity.reply.comment.post?.topic_id}/posts/${activity.reply.comment.post?.id}#comment-${activity.reply.comment.id}?reply-${activity.reply.id}`}
                            >
                              <a>{activity.reply.comment.post?.title}</a>
                            </Link>{" "}
                            中的评论
                          </span>
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NavigationBar;
