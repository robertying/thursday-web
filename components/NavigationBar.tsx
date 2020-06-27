import { useState } from "react";
import Router from "next/router";
import {
  Container,
  AppBar,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import ElevateOnScroll from "./ElevateOnScroll";

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.background.default,
      color: "black",
      top: "unset",
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
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title, page }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleAvatarClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const handleGoBack = () => {
    window.history.back();
  };

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
              spacing={2}
            >
              {page === "post" && (
                <Grid item>
                  <IconButton onClick={handleGoBack}>
                    <ArrowBack />
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <Typography variant="h4">{title ?? "星期四"}</Typography>
              </Grid>
              <Grid item xs>
                <Tabs
                  value={page === "" || page === "topics" ? page : false}
                  onChange={(e, value) => Router.push(`/${value}`)}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <StyledTab label="主页" value="" />
                  <StyledTab label="话题" value="topics" />
                </Tabs>
              </Grid>
              <Grid item>
                <IconButton
                  style={{ padding: 0, marginLeft: "auto" }}
                  onClick={handleAvatarClick}
                >
                  <Avatar src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" />
                </IconButton>
              </Grid>
            </Grid>
          </Container>
        </AppBar>
      </ElevateOnScroll>
      <Menu
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
      >
        <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
        <MenuItem onClick={handleAvatarClose}>My account</MenuItem>
        <MenuItem onClick={handleAvatarClose}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default NavigationBar;
