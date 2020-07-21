import React from "react";
import {
  useScrollTrigger,
  Container,
  Fab,
  Zoom,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardArrowUp, AddComment, Add } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      zIndex: 99,
      position: "fixed",
      bottom: theme.spacing(2),
      left: 0,
      right: 0,
    },
    center: {
      margin: "auto",
    },
  })
);

export interface FloatingActionsProps {
  threshold?: number;
  edit?: boolean;
  comment?: boolean;
  onCommentClick?: () => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  edit,
  threshold,
  comment,
  onCommentClick,
}) => {
  const classes = useStyles();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshold ?? 0,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const router = useRouter();
  const topicId = router.query.topicId;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.center}
        component={Container}
        maxWidth="md"
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Zoom in={trigger}>
            <Fab
              onClick={handleClick}
              color="secondary"
              size="small"
              aria-label="scroll back to top"
            >
              <KeyboardArrowUp />
            </Fab>
          </Zoom>
        </Grid>
        {edit && (
          <Grid item>
            <Link href="/topics/[topicId]/edit" as={`/topics/${topicId}/edit`}>
              <a>
                <Fab color="primary" size="small">
                  <Add />
                </Fab>
              </a>
            </Link>
          </Grid>
        )}
        {comment && (
          <Grid item>
            <Fab color="primary" size="small" onClick={onCommentClick}>
              <AddComment />
            </Fab>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default FloatingActions;
