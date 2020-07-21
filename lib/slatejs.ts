import { Node } from "slate";

export const getPlainText = (value: Node[]) => {
  return value.map((n) => Node.string(n)).join("\n");
};

export const getNodes = (value: string) => {
  const nodes = value.split("\n").map((p) => ({
    type: "paragraph",
    children: [{ text: p }],
  }));
  if (nodes[nodes.length - 1]?.children?.[0].text === "") {
    return nodes as Node[];
  }
  return [
    ...nodes,
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ] as Node[];
};

export const serialize = (value: Node[]) => {
  const val = [...value];
  if (val.length > 1) {
    val.pop();
  }
  return JSON.stringify(val);
};

export const deserialize = (value: string) => {
  return JSON.parse(value) as Node[];
};

export const isEmpty = (value: Node[]) => {
  return value.length === 0 || value.every((n) => !Node.string(n));
};

export const getEmptyValue = () => [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
