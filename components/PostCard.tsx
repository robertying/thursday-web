import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  Avatar,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { GetTopicPosts_topic_posts } from "apis/types";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(2),
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
  })
);

const PostCard: React.FC<GetTopicPosts_topic_posts> = ({ title }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography
            className={classes.title}
            variant="subtitle1"
            gutterBottom
          >
            {title}
          </Typography>
          <Grid container direction="row" alignItems="flex-end" spacing={1}>
            <Grid item xs>
              <AvatarGroup
                className={classes.avatars}
                classes={{ avatar: classes.smallAvatar }}
                max={3}
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                <Avatar
                  alt="Trevor Henderson"
                  src="/static/images/avatar/5.jpg"
                />
              </AvatarGroup>
            </Grid>
            <Grid container item spacing={2} xs justify="flex-end">
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  阅读 233
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  回复 12
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PostCard;
