import {
  Card,
  Typography,
  CardContent,
  CardHeader,
  IconButton,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import Avatar from "components/Avatar";
import { GetReplies_reply } from "apis/types";
import { deserialize } from "lib/slatejs";
import MyEditor from "./Editor";
import { Edit } from "@material-ui/icons";

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

export interface ReplyProps extends GetReplies_reply {
  onEdit?: (replyId: number) => void;
}

export const Reply: React.FC<ReplyProps> = ({
  author,
  content,
  created_at,
  id,
  onEdit,
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
        action={
          onEdit && (
            <IconButton onClick={() => onEdit?.(id)}>
              <Edit />
            </IconButton>
          )
        }
      />
      <CardContent
        className={classes.smallPadding}
        style={{ paddingBottom: 0 }}
      >
        <MyEditor value={deserialize(content)} readonly />
      </CardContent>
    </Card>
  );
};

export default Reply;
