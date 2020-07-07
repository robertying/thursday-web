import { Transforms } from "slate";
import {
  useSlate,
  useSelected,
  useFocused,
  ReactEditor,
  RenderElementProps,
} from "slate-react";
import isUrl from "is-url";
import { IconButton } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Image as ImageIcon } from "@material-ui/icons";
import imageExtensions from "./imageExtensions.json";
import Upload from "components/Upload";
import { useState } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: (props: { selected: boolean; focused: boolean }) => ({
      display: "block",
      maxHeight: "20em",
      boxShadow:
        props.selected && props.focused
          ? `0 0 0 2px ${theme.palette.primary.main}`
          : "none",
    }),
  })
);

export const Image = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();
  const classes = useStyles({ selected, focused });

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          className={classes.root}
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${element.url}`}
          alt={(element.alt as string | undefined) ?? "已上传图片"}
        />
      </div>
      {children}
    </div>
  );
};

export const ImageButton = ({
  size,
  toggleReadOnly,
}: {
  size?: "small" | "medium";
  toggleReadOnly?: (on: boolean) => void;
}) => {
  const editor = useSlate();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    toggleReadOnly?.(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    toggleReadOnly?.(false);
  };

  const handleInsert = (url: string) => {
    if (!url) {
      return;
    }
    insertImage(editor, url);
    handleDialogClose();
  };

  return (
    <>
      <IconButton
        size={size}
        onClick={handleDialogOpen}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ImageIcon />
      </IconButton>
      <Upload
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleInsert}
      />
    </>
  );
};

export const withImages = (editor: ReactEditor) => {
  const { isVoid, insertData } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url as string);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor: ReactEditor, url: string) => {
  const image = [
    {
      type: "image",
      url,
      children: [{ text: "" }],
    },
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];
  Transforms.insertNodes(editor, image);
};

const isImageUrl = (url?: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return ext && imageExtensions.includes(ext);
};
