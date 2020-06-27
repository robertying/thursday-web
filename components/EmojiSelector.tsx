import React, { useState } from "react";
import { IconButton, Popover, Chip, Grid, Icon } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { InsertEmoticon } from "@material-ui/icons";
import { emoji_reaction_enum } from "apis/types";

const emojis = {
  thumbs_up: "👍",
  thumbs_down: "👎",
  grinning_face_with_smiling_eyes: "😄",
  party_popper: "🎉",
  confused_face: "😕",
  red_heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

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

export interface EmojiSelectorProps {
  value?: {
    [_ in keyof typeof emojis]: number;
  };
  onReact?: (emojiName: emoji_reaction_enum) => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ value, onReact }) => {
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
        {value &&
          (Object.entries(emojis) as [emoji_reaction_enum, string][]).map(
            ([name, emoji]) =>
              value[name] ? (
                <Grid item key={name}>
                  <Chip
                    classes={{ label: classes.chip }}
                    variant="outlined"
                    onClick={() => onReact?.(name)}
                    label={`${emoji} ${value[name]}`}
                  />
                </Grid>
              ) : null
          )}
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
        {Object.entries(emojis).map(([name, emoji]) => (
          <IconButton
            key={emoji}
            className={classes.emoji}
            classes={{ label: classes.icon }}
            onClick={() => onReact?.(name as emoji_reaction_enum)}
          >
            {emoji}
          </IconButton>
        ))}
      </Popover>
    </>
  );
};

export default EmojiSelector;
