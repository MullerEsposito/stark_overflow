import { Image, Link as LinkIcon } from "phosphor-react";
import { ToolbarButton, ToolbarContainer } from "./style";

interface ToolbarProps {
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  insertMarkdown: (markdown: string, placeholder: string) => void;
}

export function Toolbar({ isUploading, insertMarkdown, fileInputRef }: ToolbarProps) {
  return (
    <ToolbarContainer>
      <ToolbarButton
        type="button"
        title="Bold"
        onClick={() => insertMarkdown("**placeholder**", "placeholder")}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Italic"
        onClick={() => insertMarkdown("*placeholder*", "placeholder")}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Heading"
        onClick={() => insertMarkdown("## placeholder", "placeholder")}
      >
        H
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Code"
        onClick={() => insertMarkdown("```\nplaceholder\n```", "placeholder")}
      >
        {"</>"}
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Link"
        onClick={() => insertMarkdown("[placeholder](url)", "placeholder")}
      >
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="List"
        onClick={() => insertMarkdown("- placeholder", "placeholder")}
      >
        • •
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Upload Image"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Image size={16} />
      </ToolbarButton>
    </ToolbarContainer>
  )
}