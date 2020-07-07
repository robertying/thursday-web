import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  Avatar,
  CardHeader,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { GetTopicPosts_topic_posts } from "apis/types";
import { getPlainText, deserialize } from "lib/slatejs";

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
  })
);

const PostCard: React.FC<GetTopicPosts_topic_posts> = ({
  title,
  content,
  updated_at,
  author,
  comments,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea>
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
            {getPlainText(deserialize(content))}
          </Typography>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs>
              <Typography className={classes.date} variant="caption">
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
