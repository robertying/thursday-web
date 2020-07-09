import React, { useState } from "react";
import {
  Grid,
  Typography,
  Container,
  ButtonBase,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { PhotoCamera, Edit } from "@material-ui/icons";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useQuery, useMutation } from "@apollo/client";
import Layout from "components/Layout";
import { initializeApollo } from "apis/client";
import {
  GetUserProfile,
  GetUserProfileVariables,
  UpdateUserAvatar,
  UpdateUserAvatarVariables,
  GetUser,
  GetUserVariables,
  UpdateUserStatus,
  UpdateUserStatusVariables,
} from "apis/types";
import {
  GET_USER_PROFILE,
  UPDATE_USER_AVATAR,
  GET_USER,
  UPDATE_USER_STATUS,
} from "apis/user";
import dayjs from "dayjs";
import useUserId from "lib/useUserId";
import Upload from "components/Upload";
import Avatar from "components/Avatar";

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
    avatarOverlay: {
      position: "relative",
      width: theme.spacing(24),
      height: theme.spacing(24),
      borderRadius: theme.spacing(12),
      opacity: (props: { hover?: boolean }) => (props.hover ? 0.8 : 1),
      cursor: (props: { hover?: boolean }) =>
        props.hover ? "pointer" : "initial",
    },
    overlayIcon: {
      position: "absolute",
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    editButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

const ProfilePage: React.FC = () => {
  const [hover, setHover] = useState(false);

  const classes = useStyles({ hover });

  const router = useRouter();
  const { username } = router.query;

  const { data: userData, refetch } = useQuery<
    GetUserProfile,
    GetUserProfileVariables
  >(GET_USER_PROFILE, {
    variables: {
      username: username as string,
    },
  });

  const user = userData?.user?.[0];
  const userId = useUserId();
  const self = user?.id === userId;

  const { data: selfData } = useQuery<GetUser, GetUserVariables>(GET_USER, {
    variables: {
      id: userId!,
    },
    skip: !userId,
  });

  const [uploadOpen, setUploadOpen] = useState(false);
  const [updateAvatar] = useMutation<
    UpdateUserAvatar,
    UpdateUserAvatarVariables
  >(UPDATE_USER_AVATAR);

  const [message, setMessage] = useState("");

  const handleAvatarUpload = async (url: string) => {
    try {
      await updateAvatar({
        variables: {
          username: user?.username!,
          avatar_url: url,
        },
      });
      setMessage("头像更新成功");
      setUploadOpen(false);
      await refetch();
    } catch {
      setMessage("头像更新失败");
    }
  };

  const [editOpen, setEditOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [updateStatus] = useMutation<
    UpdateUserStatus,
    UpdateUserStatusVariables
  >(UPDATE_USER_STATUS);

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateStatus({
        variables: {
          username: user?.username!,
          status,
        },
      });
      setMessage("状态更新成功");
      setEditOpen(false);
      await refetch();
    } catch {
      setMessage("状态更新失败");
    }
  };

  return (
    <Layout
      page="others"
      username={selfData?.user_by_pk?.username}
      userAvatarUrl={selfData?.user_by_pk?.avatar_url}
    >
      <NextSeo title={user?.username} />
      <Grid
        className={classes.root}
        container
        component={Container}
        direction="column"
        maxWidth="md"
      >
        <ButtonBase
          className={classes.avatarOverlay}
          disabled={!self}
          onClick={() => setUploadOpen(true)}
          onMouseOver={() => self && setHover(true)}
          onMouseLeave={() => self && setHover(false)}
        >
          <Avatar
            className={classes.large}
            srcSize="large"
            src={user?.avatar_url ?? undefined}
            alt={user?.username}
          />
          {hover && <PhotoCamera className={classes.overlayIcon} />}
        </ButtonBase>
        <Typography variant="h3" gutterBottom className={classes.subtitle}>
          {user?.username}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {user?.status || "未填写状态……"}
          {self && (
            <IconButton className={classes.editButton} onClick={handleEditOpen}>
              <Edit />
            </IconButton>
          )}
        </Typography>
        <Typography variant="caption" gutterBottom className={classes.date}>
          于 {dayjs(user?.created_at).fromNow()} 加入
        </Typography>
        <Typography variant="h5" gutterBottom className={classes.subtitle}>
          活动
        </Typography>
      </Grid>
      <Upload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleAvatarUpload}
        mbLimit={5}
      />
      <Dialog fullWidth open={editOpen} onClose={handleEditClose}>
        <DialogTitle>更新状态</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            placeholder="留空则清空当前状态"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            取消
          </Button>
          <Button onClick={handleStatusUpdate} color="primary">
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={message ? true : false}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        message={<span>{message}</span>}
      />
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
