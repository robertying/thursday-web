import { Node } from "slate";

export const getPlainText = (value: Node[]) => {
  return value.map((n) => Node.string(n)).join("\n");
};

export const serialize = (value: Node[]) => {
  const val = [...value];
  val.pop();
  return JSON.stringify(val);
};

export const deserialize = (value: string) => {
  return JSON.parse(value) as Node[];
};
