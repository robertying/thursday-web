import React, { useMemo, useState, useCallback } from "react";
import { createEditor, Node, Transforms, Editor } from "slate";
import {
  withReact,
  useSlate,
  ReactEditor,
  RenderElementProps,
  Slate,
  Editable,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import { isKeyHotkey } from "is-hotkey";
import { IconButton, Divider } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
} from "@material-ui/icons";
import { withImages, ImageButton, Image } from "./Image";
import { withLinks, LinkButton, Link } from "./Link";
import { withNewline } from "./Newline";
import { withMath, MathButton, Math } from "./Math";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    editable: (props: { readonly?: boolean }) => ({
      height: "100%",
      padding: props.readonly
        ? 0
        : `${theme.spacing(6)}px ${theme.spacing(8)}px`,
      overflow: "auto",
      fontSize: 16,
      lineHeight: 1.6,
    }),
    toolbar: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

function MyEditor(props: {
  className?: string;
  defaultValue?: Node[];
  readonly?: boolean;
  onChange?: (value: Node[]) => void;
}) {
  const classes = useStyles({ readonly: props.readonly });

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () =>
      withNewline(
        withMath(withImages(withLinks(withHistory(withReact(createEditor())))))
      ),
    []
  );

  const [value, setValue] = useState<Node[]>(
    props.defaultValue ?? [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]
  );

  const [readOnly, setReadOnly] = useState(false);

  return (
    <div className={`${classes.root} ${props.className}`}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
          props.onChange?.(value);
        }}
      >
        {!props.readonly && (
          <>
            <div className={classes.toolbar}>
              <MarkButton format="bold" icon={<FormatBold />} />
              <MarkButton format="italic" icon={<FormatItalic />} />
              <MarkButton format="underline" icon={<FormatUnderlined />} />
              <MarkButton format="strikethrough" icon={<StrikethroughS />} />
              <MarkButton format="code" icon={<Code />} />
              <BlockButton format="block-quote" icon={<FormatQuote />} />
              <BlockButton
                format="bulleted-list"
                icon={<FormatListBulleted />}
              />
              <BlockButton
                format="numbered-list"
                icon={<FormatListNumbered />}
              />
              <MathButton toggleReadOnly={(on) => setReadOnly(on)} />
              <LinkButton toggleReadOnly={(on) => setReadOnly(on)} />
              <ImageButton toggleReadOnly={(on) => setReadOnly(on)} />
            </div>
            <Divider />
          </>
        )}
        <Editable
          className={classes.editable}
          readOnly={props.readonly || readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isKeyHotkey(hotkey, event.nativeEvent)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
}

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const toggleBlock = (editor: ReactEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: ReactEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: ReactEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor: ReactEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "link":
      return (
        <Link attributes={attributes} element={element}>
          {children}
        </Link>
      );
    case "image":
      return (
        <Image attributes={attributes} element={element}>
          {children}
        </Image>
      );
    case "math":
      return (
        <Math attributes={attributes} element={element}>
          {children}
        </Math>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({
  format,
  icon,
  size,
}: {
  format: string;
  icon: React.ReactNode;
  size?: "small" | "medium";
}) => {
  const editor = useSlate();

  return (
    <IconButton
      color={isBlockActive(editor, format) ? "primary" : "default"}
      size={size}
      onClick={() => toggleBlock(editor, format)}
      onMouseDown={(e) => e.preventDefault()}
    >
      {icon}
    </IconButton>
  );
};

const MarkButton = ({
  format,
  icon,
  size,
}: {
  format: string;
  icon: React.ReactNode;
  size?: "small" | "medium";
}) => {
  const editor = useSlate();

  return (
    <IconButton
      color={isMarkActive(editor, format) ? "primary" : "default"}
      size={size}
      onClick={() => toggleMark(editor, format)}
      onMouseDown={(e) => e.preventDefault()}
    >
      {icon}
    </IconButton>
  );
};

export default MyEditor;
