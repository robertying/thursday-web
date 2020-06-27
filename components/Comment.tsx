import React, { useState } from "react";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Share, Favorite, Comment as CommentIcon } from "@material-ui/icons";
import dayjs from "dayjs";
import EmojiSelector from "./EmojiSelector";
import MyEditor from "./Editor";
import { GetPost_post_comments } from "apis/types";

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      padding: `${theme.spacing(2)}px ${theme.spacing(6)}px`,
    },
    date: {
      display: "block",
      marginTop: theme.spacing(2),
      fontStyle: "italic",
    },
    actions: {
      padding: theme.spacing(1),
    },
  })
);

export interface CommentProps {
  onCommentButtonClick?: () => void;
}

const Comment: React.FC<GetPost_post_comments & CommentProps> = ({
  content,
  author,
  updated_at,
  replies_aggregate,
  onCommentButtonClick,
}) => {
  const classes = useStyles();

  const [hover, setHover] = useState(false);

  return (
    <Card onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <CardHeader
        avatar={<Avatar src={author.avatar_url ?? undefined} />}
        title={author.username}
        subheader={author.status ?? ""}
      />
      <CardContent className={classes.content}>
        <MyEditor defaultValue={JSON.parse(content)} readonly />
        <Typography className={classes.date} variant="caption">
          编辑于 {dayjs(updated_at).fromNow()}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          className={classes.actions}
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid
            container
            item
            justify="flex-start"
            alignItems="center"
            spacing={1}
            xs
          >
            {onCommentButtonClick && (
              <Grid item>
                <Button
                  startIcon={<CommentIcon color="action" />}
                  onClick={onCommentButtonClick}
                >
                  {replies_aggregate.aggregate?.count}
                </Button>
              </Grid>
            )}
            <Grid item>
              <EmojiSelector />
            </Grid>
          </Grid>
          <Grid
            container
            item
            justify="flex-end"
            alignItems="center"
            xs
            style={{ visibility: hover ? "visible" : "hidden" }}
          >
            <Grid item>
              <IconButton>
                <Favorite />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton>
                <Share />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Comment;
