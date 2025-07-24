import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

type RenderJsonProps = {
  jsonContent: JSONContent;
};

export const RenderJson = ({ jsonContent }: RenderJsonProps) => {
  const output = useMemo(
    () =>
      generateHTML(jsonContent, [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ]),
    [jsonContent]
  );
  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
};
