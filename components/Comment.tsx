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
import { GetPost_post_comments, emoji_reaction_enum } from "apis/types";
import { deserialize } from "lib/slatejs";

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
    row: {
      display: "flex",
      flexDirection: "row",
      "& > *": {
        marginLeft: 4,
        marginRight: 4,
      },
    },
  })
);

export interface CommentProps {
  onReact?: (commentId: number, reaction: emoji_reaction_enum) => void;
  onShare?: (commentId: number) => void;
  onCommentButtonClick?: () => void;
}

const Comment: React.FC<GetPost_post_comments & CommentProps> = ({
  id,
  content,
  author,
  updated_at,
  replies_aggregate,
  reaction_aggregate,
  onReact,
  onShare,
  onCommentButtonClick,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar src={author.avatar_url ?? undefined} alt={author.username} />
        }
        title={author.username}
        subheader={author.status ?? ""}
      />
      <CardContent className={classes.content}>
        <MyEditor defaultValue={deserialize(content)} readonly />
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
          <div className={classes.row}>
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
              <EmojiSelector
                value={reaction_aggregate ?? undefined}
                onReact={(emojiName) => onReact?.(id, emojiName)}
              />
            </Grid>
          </div>
          <div className={classes.row}>
            <Grid item>
              <IconButton>
                <Favorite />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={() => onShare?.(id)}>
                <Share />
              </IconButton>
            </Grid>
          </div>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Comment;
