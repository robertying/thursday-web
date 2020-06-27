import React, { useState } from "react";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Share, Favorite } from "@material-ui/icons";
import dayjs from "dayjs";
import EmojiSelector from "./EmojiSelector";
import MyEditor from "./Editor";
import { GetPost_post, emoji_reaction_enum } from "apis/types";

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
  onReact?: (postId: number, reaction: emoji_reaction_enum) => void;
}

const Post: React.FC<GetPost_post & PostProps> = ({
  id,
  title,
  content,
  author,
  updated_at,
  reaction,
  onReact,
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
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
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
          alignItems="center"
        >
          <Grid item xs>
            <EmojiSelector
              value={reaction ?? undefined}
              onReact={(emojiName) => onReact?.(id, emojiName)}
            />
          </Grid>
          <Grid item style={{ visibility: hover ? "visible" : "hidden" }}>
            <IconButton>
              <Favorite />
            </IconButton>
            <IconButton>
              <Share />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Post;
