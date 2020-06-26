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
          src={element.url as string}
          alt={element.alt as string}
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

  return (
    <IconButton
      size={size}
      onClick={() => {
        const url = window.prompt("Enter the URL of the link:");
        if (!url) return;
        insertImage(editor, url);
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ImageIcon />
    </IconButton>
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
