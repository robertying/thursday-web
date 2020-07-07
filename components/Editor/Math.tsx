import { useState } from "react";
import { Transforms } from "slate";
import {
  useSlate,
  ReactEditor,
  RenderElementProps,
  useEditor,
} from "slate-react";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Functions } from "@material-ui/icons";
import katex from "katex";
import LightTooltip from "components/LightTooltip";

export const Math = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useEditor();

  return (
    <span {...attributes}>
      <LightTooltip
        title={<span>{element.src as string}</span>}
        placement="top"
        interactive
        open={ReactEditor.isReadOnly(editor) ? false : undefined}
      >
        <span
          contentEditable={false}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(element.src as string, {
              displayMode: element.display as boolean,
              throwOnError: false,
            }),
          }}
        />
      </LightTooltip>
      {children}
    </span>
  );
};

const useDialogStyles = makeStyles((theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "column",
      "& > *": {
        margin: `${theme.spacing(2)}px auto`,
      },
    },
  })
);

export const MathButton = ({
  size,
  toggleReadOnly,
}: {
  size?: "small" | "medium";
  toggleReadOnly?: (on: boolean) => void;
}) => {
  const classes = useDialogStyles();
  const editor = useSlate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [display, setDisplay] = useState(false);
  const [src, setSrc] = useState("");

  const handleDialogOpen = () => {
    toggleReadOnly?.(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    toggleReadOnly?.(false);
  };

  const handleInsert = () => {
    if (!src) {
      return;
    }
    insertMath(editor, src, display);
    handleDialogClose();
    setSrc("");
  };

  return (
    <>
      <IconButton
        size={size}
        onClick={handleDialogOpen}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Functions />
      </IconButton>
      <Dialog fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <form className={classes.form}>
            <ToggleButtonGroup
              size="small"
              value={display}
              exclusive
              onChange={(e, value) => setDisplay(value)}
            >
              <ToggleButton value={false}>内联</ToggleButton>
              <ToggleButton value={true}>外显</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              autoFocus
              multiline
              fullWidth
              placeholder="a^2+b^2"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClose}>
            取消
          </Button>
          <Button color="primary" onClick={handleInsert}>
            插入
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const withMath = (editor: ReactEditor) => {
  const { isVoid, isInline } = editor;

  editor.isVoid = (element) => {
    return element.type === "math" && element.display ? true : isVoid(element);
  };

  editor.isInline = (element) => {
    return element.type === "math" && !element.display
      ? true
      : isInline(element);
  };

  return editor;
};

const insertMath = (editor: ReactEditor, src: string, display: boolean) => {
  const math = { type: "math", src, display, children: [{ text: "" }] };
  Transforms.insertNodes(editor, math);
};
