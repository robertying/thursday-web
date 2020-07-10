import { Card, Typography, CardContent, CardHeader } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import Avatar from "components/Avatar";
import { GetReplies_reply } from "apis/types";
import { deserialize } from "lib/slatejs";
import MyEditor from "./Editor";

const useStyles = makeStyles((theme) =>
  createStyles({
    smallPadding: {
      padding: theme.spacing(0.5),
    },
    card: {
      margin: theme.spacing(1),
    },
    date: {
      display: "block",
      fontStyle: "italic",
    },
  })
);

const ReplyCard: React.FC<GetReplies_reply> = ({
  author,
  content,
  created_at,
  id,
}) => {
  const classes = useStyles();

  return (
    <Card
      id={`reply-${id}`}
      elevation={0}
      className={`${classes.smallPadding} ${classes.card}`}
    >
      <CardHeader
        className={classes.smallPadding}
        avatar={
          <Avatar
            alt={author.username}
            src={author.avatar_url ?? undefined}
            srcSize="medium"
          />
        }
        title={author.username}
        subheader={
          <Typography
            className={classes.date}
            variant="caption"
            color="textSecondary"
          >
            编辑于 {dayjs(created_at).fromNow()}
          </Typography>
        }
      />
      <CardContent
        className={classes.smallPadding}
        style={{ paddingBottom: 0 }}
      >
        <MyEditor defaultValue={deserialize(content)} readonly />
      </CardContent>
    </Card>
  );
};

export default ReplyCard;
