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
import { isMobile } from "lib/platform";
import { getEmptyValue } from "lib/slatejs";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    editable: (props: { readonly?: boolean; compact?: boolean }) => ({
      height: "100%",
      padding: props.readonly
        ? 0
        : props.compact
        ? `${theme.spacing(3)}px ${theme.spacing(4)}px`
        : `${theme.spacing(6)}px ${theme.spacing(8)}px`,
      overflow: "auto",
      fontSize: 16,
      lineHeight: 1.6,
      [theme.breakpoints.down("sm")]: {
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
      },
    }),
    textarea: {
      resize: "none",
      border: "none",
      outline: "none",
      boxShadow: "none",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: (props: { readonly?: boolean }) =>
        props.readonly
          ? theme.palette.background.paper
          : theme.palette.background.default,
    },
    toolbar: {
      overflowX: "auto",
      overflowY: "hidden",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

export interface MyEditorProps {
  className?: string;
  value?: Node[];
  plainTextValue?: string;
  readonly?: boolean;
  onChange?: (value: Node[]) => void;
  onPlainTextChange?: (value: string) => void;
  compact?: boolean;
}

const MyEditor: React.FC<MyEditorProps> = ({
  className,
  value,
  plainTextValue,
  readonly,
  onChange,
  onPlainTextChange,
  compact,
}) => {
  const classes = useStyles({
    readonly,
    compact,
  });

  const size = compact ? "small" : "medium";

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () =>
      withNewline(
        withMath(withImages(withLinks(withHistory(withReact(createEditor())))))
      ),
    []
  );

  const [readOnly, setReadOnly] = useState(false);

  const isMobilePlatform = useMemo(() => isMobile(), []);

  return isMobilePlatform && !(readonly || readOnly) ? (
    <textarea
      className={`MuiInputBase-root ${classes.editable} ${classes.textarea} ${
        className ?? ""
      }`}
      autoFocus
      autoCapitalize="on"
      autoCorrect="on"
      spellCheck
      value={plainTextValue ?? ""}
      onChange={(e) => {
        onPlainTextChange?.(e.target.value);
      }}
    />
  ) : (
    <div className={`${classes.root} ${className ?? ""}`}>
      <Slate
        editor={editor}
        value={value ?? getEmptyValue()}
        onChange={(value) => {
          onChange?.(value);
        }}
      >
        {!readonly && (
          <>
            <div className={classes.toolbar}>
              <MarkButton format="bold" icon={<FormatBold />} size={size} />
              <MarkButton format="italic" icon={<FormatItalic />} size={size} />
              <MarkButton
                format="underline"
                icon={<FormatUnderlined />}
                size={size}
              />
              <MarkButton
                format="strikethrough"
                icon={<StrikethroughS />}
                size={size}
              />
              <MarkButton format="code" icon={<Code />} size={size} />
              <BlockButton
                format="block-quote"
                icon={<FormatQuote />}
                size={size}
              />
              <BlockButton
                format="bulleted-list"
                icon={<FormatListBulleted />}
                size={size}
              />
              <BlockButton
                format="numbered-list"
                icon={<FormatListNumbered />}
                size={size}
              />
              <MathButton
                toggleReadOnly={(on) => setReadOnly(on)}
                size={size}
              />
              <LinkButton
                toggleReadOnly={(on) => setReadOnly(on)}
                size={size}
              />
              <ImageButton
                toggleReadOnly={(on) => setReadOnly(on)}
                size={size}
              />
            </div>
            <Divider />
          </>
        )}
        <Editable
          className={classes.editable}
          readOnly={readonly || readOnly}
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
};

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
