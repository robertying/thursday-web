import { Node } from "slate";

export const getPlainText = (value: Node[]) => {
  return value.map((n) => Node.string(n)).join("\n");
};
