import React from "react";
import {
  useScrollTrigger,
  Container,
  Fab,
  Zoom,
  Grid,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Edit, KeyboardArrowUp } from "@material-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: "auto",
      position: "fixed",
      bottom: theme.spacing(2),
      left: 0,
      right: -theme.spacing(12),
    },
  })
);

export interface FloatingActionsProps {
  threshold?: number;
  edit?: boolean;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  edit,
  threshold,
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
    <Grid
      className={classes.root}
      component={Container}
      maxWidth="md"
      container
      direction="row"
      justify="flex-end"
      alignItems="center"
      spacing={1}
    >
      {edit && (
        <Grid item>
          <Link href="/topics/[topicId]/edit" as={`/topics/${topicId}/edit`}>
            <a>
              <Fab color="primary" size="small" aria-label="new post">
                <Edit />
              </Fab>
            </a>
          </Link>
        </Grid>
      )}
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
    </Grid>
  );
};

export default FloatingActions;
