import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { GetTopics_category_topics } from "apis/types";
import Avatar from "components/Avatar";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(2),
    },
    postTitle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: 300,
    },
    smallAvatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontSize: "1.3em",
    },
  })
);

const TopicCard: React.FC<GetTopics_category_topics> = ({ name, posts }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography className={classes.title} variant="h6" gutterBottom>
            {name}
          </Typography>
          <Grid container>
            {posts.map((post) => (
              <Grid
                key={post.id}
                container
                item
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Typography className={classes.postTitle} variant="body1">
                    {post.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <AvatarGroup
                    classes={{ avatar: classes.smallAvatar }}
                    max={3}
                  >
                    <Avatar
                      alt={post.author.username}
                      src={post.author.avatar_url ?? undefined}
                    />
                    {post.comments.map((comment) => {
                      <Avatar
                        alt={comment.author.username}
                        src={comment.author.avatar_url ?? undefined}
                      />;
                    })}
                  </AvatarGroup>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TopicCard;
