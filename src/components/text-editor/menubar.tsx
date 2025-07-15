import { ComponentType } from "react";
import { Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  StrikethroughIcon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  UndoIcon,
  RedoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MenubarProps = {
  editor: Editor | null;
  isDisabled?: boolean;
};

type ButtonConfig = {
  Icon: ComponentType;
  tooltip: string;
  active?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
  disabled?: boolean;
};

export const Menubar = ({ editor, isDisabled }: MenubarProps) => {
  if (!editor) {
    return null;
  }

  const buttonConfigsFormatting: ButtonConfig[] = [
    {
      Icon: BoldIcon,
      tooltip: "Bold",
      active: (editor) => editor.isActive("bold"),
      onClick: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      Icon: ItalicIcon,
      tooltip: "Italic",
      active: (editor) => editor.isActive("italic"),
      onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      Icon: StrikethroughIcon,
      tooltip: "Strike",
      active: (editor) => editor.isActive("strike"),
      onClick: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
      Icon: Heading1Icon,
      tooltip: "Heading 1",
      active: (editor) => editor.isActive("heading", { level: 1 }),
      onClick: (editor) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      Icon: Heading2Icon,
      tooltip: "Heading 2",
      active: (editor) => editor.isActive("heading", { level: 2 }),
      onClick: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      Icon: Heading3Icon,
      tooltip: "Heading 3",
      active: (editor) => editor.isActive("heading", { level: 3 }),
      onClick: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      Icon: ListIcon,
      tooltip: "Bullet List",
      active: (editor) => editor.isActive("bulletList"),
      onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      Icon: ListOrderedIcon,
      tooltip: "Ordered List",
      active: (editor) => editor.isActive("orderedList"),
      onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  const buttonConfigsAlignment: ButtonConfig[] = [
    {
      Icon: AlignLeftIcon,
      tooltip: "Align Left",
      active: (editor) => editor.isActive("link"),
      onClick: (editor) => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      Icon: AlignCenterIcon,
      tooltip: "Align Center",
      active: (editor) => editor.isActive("link"),
      onClick: (editor) => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      Icon: AlignRightIcon,
      tooltip: "Align Right",
      active: (editor) => editor.isActive("link"),
      onClick: (editor) => editor.chain().focus().setTextAlign("right").run(),
    },
  ];

  const buttonConfigsUndoRedo: ButtonConfig[] = [
    {
      Icon: UndoIcon,
      tooltip: "Undo",
      onClick: (editor) => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      Icon: RedoIcon,
      tooltip: "Redo",
      onClick: (editor) => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex  flex-wrap items-center gap-1 border-b border-input  p-2 bg-card">
      <div className="flex items-center gap-1 flex-wrap">
        {buttonConfigsFormatting.map(
          ({ Icon, active, onClick, tooltip }, index) => {
            const isActive = active?.(editor);
            const handleClick = () => onClick(editor);

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Toggle
                    disabled={isDisabled}
                    size="sm"
                    pressed={isActive}
                    onPressedChange={handleClick}
                    className={cn(
                      isActive &&
                        "bg-muted dark:bg-accent-foreground text-muted-foreground"
                    )}
                  >
                    <Icon />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            );
          }
        )}
      </div>
      <div className="w-px h-6 bg-border mx-2" />
      <div className="flex items-center gap-1 flex-wrap">
        {buttonConfigsAlignment.map(
          ({ Icon, active, onClick, tooltip }, index) => {
            const isActive = active?.(editor);
            const handleClick = () => onClick(editor);

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Toggle
                    disabled={isDisabled}
                    size="sm"
                    pressed={isActive}
                    onPressedChange={handleClick}
                    className={cn(
                      isActive &&
                        "bg-muted dark:bg-accent-foreground text-muted-foreground"
                    )}
                  >
                    <Icon />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            );
          }
        )}
      </div>
      <div className="w-px h-6 bg-border mx-2" />
      <div className="flex items-center gap-1 flex-wrap">
        {buttonConfigsUndoRedo.map(
          ({ Icon, disabled, onClick, tooltip }, index) => {
            const handleClick = () => onClick(editor);

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={handleClick}
                    disabled={disabled || isDisabled}
                  >
                    <Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            );
          }
        )}
      </div>
    </div>
  );
};
