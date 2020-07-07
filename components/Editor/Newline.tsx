import { Transforms, Element } from "slate";
import { ReactEditor } from "slate-react";

export const withNewline = (editor: ReactEditor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      const last = editor.children.slice(-1).pop();
      if (
        last?.type !== "paragraph" ||
        (last?.children as Element[])?.[0]?.text !== ""
      ) {
        const paragraph = { type: "paragraph", children: [{ text: "" }] };
        Transforms.insertNodes(editor, paragraph, {
          at: path.concat(editor.children.length),
        });
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};
