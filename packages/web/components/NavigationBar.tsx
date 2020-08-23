import { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  useMediaQuery,
  Badge,
  Switch,
  FormControlLabel,
  Divider,
  Snackbar,
  Button,
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
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  GetActivities,
  GetActivitiesVariables,
  MarkActivityRead,
  MarkActivityReadVariables,
} from "apis/types";
import { GET_ACTIVITIES, MARK_ACTIVITY_READ } from "apis/activity";
import useUserId from "lib/useUserId";
import usePushSubscription from "lib/usePushSubscription";
import { isLearnXUser } from "lib/learnx";
import Avatar from "components/Avatar";
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
    list: {
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
    switch: {
      margin: theme.spacing(1),
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

  const router = useRouter();

  const userId = useUserId();
  const [pushEnabled, subscribe] = usePushSubscription();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [message, setMessage] = useState("");

  const [getActivities, { data, loading, refetch }] = useLazyQuery<
    GetActivities,
    GetActivitiesVariables
  >(GET_ACTIVITIES, {
    variables: {
      user_id: userId!,
    },
  });
  const [markActivityRead] = useMutation<
    MarkActivityRead,
    MarkActivityReadVariables
  >(MARK_ACTIVITY_READ);

  const classes = useStyles({
    loading: loading || data?.activity.length === 0,
  });

  const handleActivityClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(e.currentTarget);
    if (userId && !isLearnXUser(userId)) {
      getActivities();
    }
  };

  const handleActivityClose = () => {
    setAnchorEl(null);
  };

  const handlePushChange = async (checked: boolean) => {
    try {
      await subscribe(checked);
    } catch {
      setMessage("通知权限未授予");
    }
  };

  useEffect(() => {
    if (data) {
      setTimeout(async () => {
        if (
          data?.activity[0]?.created_at &&
          data?.activity.some((a) => !a.read)
        ) {
          await markActivityRead({
            variables: {
              before: data?.activity[0]?.created_at,
            },
          });
          await refetch?.();
        }
      }, 1000);
    }
  }, [data]);

  return (
    <>
      <ElevateOnScroll>
        <AppBar className={classes.appBar} color="secondary">
          <Container maxWidth="md">
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              spacing={1}
              wrap="nowrap"
              style={{ overflow: "hidden" }}
            >
              {((isLearnXUser(userId) && router.asPath.includes("/posts/")) ||
                (!isLearnXUser(userId) && backHref)) && (
                <Grid item>
                  <IconButton
                    size={sm ? "small" : "medium"}
                    onClick={router.back}
                  >
                    <ArrowBack />
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <Typography variant={sm ? "h6" : "h4"} noWrap>
                  {title ?? "星期四"}
                </Typography>
              </Grid>
              <Grid item xs style={{ overflow: "auto", minHeight: 64 }}>
                {!isLearnXUser(userId) && (
                  <Tabs
                    value={page === "" || page === "topics" ? page : false}
                    onChange={(e, value) => router.push(`/${value}`)}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    scrollButtons="auto"
                  >
                    <StyledTab label="主页" value="" />
                    <StyledTab label="话题" value="topics" />
                  </Tabs>
                )}
              </Grid>
              <Grid
                item
                style={{
                  visibility:
                    !username || isLearnXUser(userId) ? "hidden" : "visible",
                }}
              >
                <IconButton
                  onClick={handleActivityClick}
                  size={sm ? "small" : "medium"}
                >
                  <Badge
                    variant="dot"
                    color="primary"
                    invisible={!data?.activity.some((i) => !i.read)}
                  >
                    <Notifications />
                  </Badge>
                </IconButton>
              </Grid>
              <Grid
                item
                style={{
                  display: isLearnXUser(userId) ? "initial" : "none",
                }}
              >
                <Button
                  color="primary"
                  size="small"
                  onClick={() => (window.location.href = "/register")}
                >
                  注册
                </Button>
              </Grid>
              <Grid
                item
                style={{
                  visibility: !username ? "hidden" : "visible",
                }}
              >
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
            </Grid>
          </Container>
        </AppBar>
      </ElevateOnScroll>
      <Popover
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
        <FormControlLabel
          className={classes.switch}
          control={
            <Switch
              checked={pushEnabled}
              color="primary"
              onChange={(e, checked) => handlePushChange(checked)}
            />
          }
          label="推送通知"
        />
        <Divider />
        <div className={classes.list}>
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
                <ListItem
                  key={activity.id}
                  style={{
                    backgroundColor: activity.read
                      ? "initial"
                      : "rgb(255, 221,255)",
                  }}
                >
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
                                as={`/topics/${activity.reply.comment.post?.topic_id}/posts/${activity.reply.comment.post?.id}#comment-${activity.reply.comment.id}?reply=${activity.reply.id}`}
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
        </div>
      </Popover>
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
    </>
  );
};

export default NavigationBar;
