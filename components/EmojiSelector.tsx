import React, { useState } from "react";
import { IconButton, Popover, Chip, Grid, Icon } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { InsertEmoticon } from "@material-ui/icons";

const emojis = ["👍", "👎", "😄", "🎉", "😕", "❤️", "🚀", "👀"];

const useStyles = makeStyles((theme) =>
  createStyles({
    emoji: {
      margin: theme.spacing(1),
      color: "inherit",
    },
    icon: {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
    chip: {
      fontSize: "1rem",
    },
  })
);

const EmojiSelector: React.FC = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid
        container
        justify="flex-start"
        alignItems="center"
        wrap="wrap"
        spacing={1}
      >
        <Grid item>
          <Chip
            classes={{ label: classes.chip }}
            variant="outlined"
            clickable
            label="👍 233"
          />
        </Grid>
        <Grid item>
          <Chip
            classes={{ label: classes.chip }}
            variant="outlined"
            clickable
            label="😄 3"
          />
        </Grid>
        <Grid item>
          <IconButton onClick={handleClick}>
            <InsertEmoticon />
          </IconButton>
        </Grid>
      </Grid>
      <Popover
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        {emojis.map((emoji) => (
          <IconButton
            key={emoji}
            className={classes.emoji}
            classes={{ label: classes.icon }}
          >
            {emoji}
          </IconButton>
        ))}
      </Popover>
    </>
  );
};

export default EmojiSelector;
