import {
  Card,
  CardActionArea,
  Typography,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Avatar from "components/Avatar";

const useStyles = makeStyles((theme) =>
  createStyles({
    smallPadding: {
      padding: theme.spacing(0.5),
    },
    card: {
      margin: theme.spacing(1),
    },
  })
);

const CommentCard: React.FC = (props) => {
  const classes = useStyles();

  return (
    <CardActionArea>
      <Card elevation={0} className={`${classes.smallPadding} ${classes.card}`}>
        <CardHeader
          className={classes.smallPadding}
          avatar={<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />}
          title="robertying"
        />
        <CardContent
          className={classes.smallPadding}
          style={{ paddingBottom: 0 }}
        >
          <Typography gutterBottom variant="body2">
            我能吞下玻璃而不伤身体。我能吞下玻璃而不伤身体。我能吞下玻璃而不伤身体。我能吞下玻璃而不伤身体。
          </Typography>
          <Typography variant="caption" color="textSecondary">
            3 天前
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default CommentCard;
