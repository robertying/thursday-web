import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  CardHeader,
  CardActions,
  Chip,
  ChipProps,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { GetTopicPosts_topic_posts } from "apis/types";
import { getPlainText, deserialize } from "lib/slatejs";
import Avatar from "components/Avatar";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      margin: `0px ${theme.spacing(2)}px`,
      marginBottom: theme.spacing(4),
      textOverflow: "ellipsis",
      overflow: "hidden",
      lineClamp: 2,
      display: "box",
      boxOrient: "vertical",
    },
    smallAvatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontSize: "1.3em",
    },
    avatars: {
      marginLeft: theme.spacing(1),
    },
    date: {
      display: "block",
      marginTop: theme.spacing(2),
      fontStyle: "italic",
    },
    chips: {
      padding: theme.spacing(2),
      display: "block",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

const truncateContent = (text: string) => {
  const length = 100;
  if (text.length > length) {
    return text.substr(0, length) + "...";
  }
  return text;
};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const PostCard: React.FC<PartialBy<GetTopicPosts_topic_posts, "post_tags">> = ({
  title,
  content,
  updated_at,
  author,
  comments,
  topic_id,
  post_tags,
}) => {
  const classes = useStyles();

  const router = useRouter();

  const handleChipMouseDown: ChipProps["onMouseDown"] = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Card>
      <CardActionArea>
        {post_tags && post_tags.length > 0 && (
          <CardActions classes={{ root: classes.chips }}>
            {post_tags.map((pt) => (
              <Chip
                className={classes.chip}
                onMouseDown={handleChipMouseDown}
                onClick={(e) => {
                  handleChipMouseDown(e);
                  router.push({
                    pathname: `/topics/${topic_id}`,
                    query: { tag: pt.tag.name },
                  });
                }}
                key={pt.tag.id}
                label={pt.tag.name}
              />
            ))}
          </CardActions>
        )}
        <CardHeader
          avatar={
            <Avatar
              src={author.avatar_url ?? undefined}
              alt={author.username}
            />
          }
          title={title}
          subheader={author.username}
        />
        <CardContent>
          <Typography className={classes.title} variant="body1">
            {truncateContent(getPlainText(deserialize(content)))}
          </Typography>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs>
              <Typography
                className={classes.date}
                variant="caption"
                color="textSecondary"
              >
                {dayjs(updated_at).fromNow()}
              </Typography>
            </Grid>
            <Grid item>
              <AvatarGroup
                className={classes.avatars}
                classes={{ avatar: classes.smallAvatar }}
                max={3}
              >
                {comments.map((comment) => (
                  <Avatar
                    key={comment.id}
                    alt={comment.author.username}
                    src={comment.author.avatar_url ?? undefined}
                  />
                ))}
              </AvatarGroup>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PostCard;
