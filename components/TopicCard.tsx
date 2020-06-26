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
import { GetTopics_topic } from "apis/types";

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

const TopicCard: React.FC<GetTopics_topic> = ({ name, posts }) => {
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
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <Avatar
                      alt="Travis Howard"
                      src="/static/images/avatar/2.jpg"
                    />
                    <Avatar
                      alt="Cindy Baker"
                      src="/static/images/avatar/3.jpg"
                    />
                    <Avatar
                      alt="Agnes Walker"
                      src="/static/images/avatar/4.jpg"
                    />
                    <Avatar
                      alt="Trevor Henderson"
                      src="/static/images/avatar/5.jpg"
                    />
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
