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
import { CardProps } from "@material-ui/core/Card";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Share, Favorite, Comment } from "@material-ui/icons";
import Article from "./Article";
import EmojiSelector from "./EmojiSelector";
import MyEditor from "./Editor";
import { GetPost_post } from "apis/types";

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

export interface PostProps {
  onCommentButtonClick?: () => void;
}

const Post: React.FC<GetPost_post & PostProps> = ({
  title,
  content,
  author,
  onCommentButtonClick,
}) => {
  const classes = useStyles();

  const [hover, setHover] = useState(false);

  return (
    <Card onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <CardHeader
        avatar={<Avatar src={author.avatar_url ?? undefined} />}
        title={author.username}
        subheader="苦逼申请中……"
      />
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <MyEditor defaultValue={JSON.parse(content)} readonly />
        <Typography className={classes.date} variant="caption">
          编辑于 3 天前
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
                  startIcon={<Comment color="action" />}
                  onClick={onCommentButtonClick}
                >
                  251
                </Button>
              </Grid>
            )}
            <Grid item>
              <EmojiSelector />
            </Grid>
          </Grid>
          <Grid container item justify="flex-end" alignItems="center" xs>
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

export default Post;
