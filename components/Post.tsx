import {
  Card,
  Typography,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Share, Edit } from "@material-ui/icons";
import dayjs from "dayjs";
import EmojiSelector from "./EmojiSelector";
import MyEditor from "./Editor";
import { GetPost_post, emoji_reaction_enum } from "apis/types";
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
  })
);

export interface PostProps extends GetPost_post {
  onReact?: (postId: number, reaction: emoji_reaction_enum) => void;
  onEdit?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

const Post: React.FC<PostProps> = ({
  id,
  title,
  content,
  author,
  updated_at,
  reaction_aggregate,
  onReact,
  onEdit,
  onShare,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={
          <Link href="/users/[userId]" as={`/users/${author.username}`}>
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
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <MyEditor value={deserialize(content)} readonly />
        <Typography
          className={classes.date}
          variant="caption"
          color="textSecondary"
        >
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
              value={reaction_aggregate ?? undefined}
              onReact={(emojiName) => onReact?.(id, emojiName)}
            />
          </Grid>
          <Grid item>
            {onEdit && (
              <IconButton onClick={() => onEdit?.(id)}>
                <Edit />
              </IconButton>
            )}
            <IconButton onClick={() => onShare?.(id)}>
              <Share />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Post;
