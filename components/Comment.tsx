import {
  Card,
  Typography,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Share, Comment as CommentIcon, Reply, Edit } from "@material-ui/icons";
import dayjs from "dayjs";
import EmojiSelector from "./EmojiSelector";
import MyEditor from "./Editor";
import { GetPost_post_comments, emoji_reaction_enum } from "apis/types";
import { deserialize } from "lib/slatejs";
import Avatar from "components/Avatar";
import Link from "next/link";

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      padding: `${theme.spacing(2)}px ${theme.spacing(6)}px`,
      [theme.breakpoints.down("sm")]: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      },
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
      alignItems: "center",
      "& > *": {
        marginLeft: 4,
        marginRight: 4,
      },
    },
  })
);

export interface CommentProps extends GetPost_post_comments {
  onReact?: (commentId: number, reaction: emoji_reaction_enum) => void;
  onEdit?: (commentId: number) => void;
  onShare?: (commentId: number) => void;
  onReply?: (commentId: number) => void;
  onReplyButtonClick?: () => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  updated_at,
  replies_aggregate,
  reaction_aggregate,
  onReact,
  onEdit,
  onShare,
  onReply,
  onReplyButtonClick,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={
          <Link href={`/users/${author.username}`}>
            <a>
              <Avatar
                src={author.avatar_url ?? undefined}
                alt={author.username}
              />
            </a>
          </Link>
        }
        title={author.username}
        subheader={author.status ?? ""}
      />
      <CardContent className={classes.content}>
        <MyEditor value={deserialize(content)} readonly />
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
            {onReplyButtonClick && replies_aggregate.aggregate?.count !== 0 && (
              <Grid item>
                <Button
                  startIcon={<CommentIcon color="action" />}
                  onClick={onReplyButtonClick}
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
            {onEdit && (
              <Grid item>
                <IconButton onClick={() => onEdit?.(id)}>
                  <Edit />
                </IconButton>
              </Grid>
            )}
            {onReply && (
              <Grid item>
                <IconButton onClick={() => onReply?.(id)}>
                  <Reply />
                </IconButton>
              </Grid>
            )}
            {onShare && (
              <Grid item>
                <IconButton onClick={() => onShare?.(id)}>
                  <Share />
                </IconButton>
              </Grid>
            )}
          </div>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Comment;
