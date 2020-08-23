import { useState } from "react";
import { Transforms, Editor, Range } from "slate";
import {
  useSlate,
  ReactEditor,
  RenderElementProps,
  useEditor,
} from "slate-react";
import isUrl from "is-url";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import { Link as LinkIcon } from "@material-ui/icons";
import LightTooltip from "components/LightTooltip";

export const Link = ({ attributes, children, element }: RenderElementProps) => {
  const editor = useEditor();

  return (
    <LightTooltip
      title={
        <a
          href={element.url as string}
          target="_blank"
          rel="noreferrer noopener"
        >
          {element.url as string}
        </a>
      }
      placement="top"
      interactive
      open={ReactEditor.isReadOnly(editor) ? false : undefined}
    >
      <a
        {...attributes}
        href={element.url as string}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    </LightTooltip>
  );
};

export const LinkButton = ({
  size,
  toggleReadOnly,
}: {
  size?: "small" | "medium";
  toggleReadOnly?: (on: boolean) => void;
}) => {
  const editor = useSlate();

  const [dialogOpen, setDialogOpen] = useState(false);
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
    if (!src.startsWith("http://") && !src.startsWith("https://")) {
      insertLink(editor, "http://" + src);
    } else {
      insertLink(editor, src);
    }
    handleDialogClose();
    setSrc("");
  };

  return (
    <>
      <IconButton
        color={isLinkActive(editor) ? "primary" : "default"}
        size={size}
        onClick={handleDialogOpen}
        onMouseDown={(e) => e.preventDefault()}
      >
        <LinkIcon />
      </IconButton>
      <Dialog fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>插入链接</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="https://www.baidu.com"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
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

export const withLinks = (editor: ReactEditor) => {
  const { insertText, isInline, insertData } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertLink = (editor: ReactEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const isLinkActive = (editor: ReactEditor) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === "link" });
  return !!link;
};

const unwrapLink = (editor: ReactEditor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
};

const wrapLink = (editor: ReactEditor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
