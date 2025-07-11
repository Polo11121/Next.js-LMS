"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Menubar } from "@/components/text-editor/menubar";
import { cn } from "@/lib/utils";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

type TextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  isError: boolean;
};

export const TextEditor = ({ value, onChange, isError }: TextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] outline-none px-3 py-2 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none text-foreground text-[16px]",
      },
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onUpdate: ({ editor }) => onChange(JSON.stringify(editor.getJSON())),
    content: value,
  });

  return (
    <div
      className={cn(
        "w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 transition-all duration-200",
        isFocused && "border-ring ring-ring/50 ring-[3px]",
        isError && "border-destructive"
      )}
    >
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
