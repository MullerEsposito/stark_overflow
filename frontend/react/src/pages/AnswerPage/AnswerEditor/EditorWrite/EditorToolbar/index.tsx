import { TextBolder, TextItalic, Code, Link as LinkIcon, Image } from "phosphor-react"
import { EditorToolbarContainer, ToolbarButton } from "./styles"
import { useAnswerEditor } from "../../useAnswerEditor"

interface EditorToolbarProps {
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  fileInputRef: React.RefObject<HTMLInputElement>
}

export function EditorToolbar({ textAreaRef, fileInputRef }: EditorToolbarProps) {
  const { content, setContent, isFileUploading } = useAnswerEditor()
   // Insert markdown formatting
   const insertMarkdown = (markdownSyntax: string, placeholder = "") => {
    if (!textAreaRef.current) return

    const textarea = textAreaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newText = ""
    if (selectedText) {
      // If text is selected, wrap it with markdown syntax
      newText = content.substring(0, start) + markdownSyntax.replace(placeholder, selectedText) + content.substring(end)
    } else {
      // If no text is selected, just insert the markdown syntax with placeholder
      newText = content.substring(0, start) + markdownSyntax + content.substring(end)
    }

    setContent(newText)

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + markdownSyntax.indexOf(placeholder) + (selectedText ? selectedText.length : 0)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }
  return (
    <EditorToolbarContainer>
      <ToolbarButton type="button" title="Bold" onClick={() => insertMarkdown("**placeholder**", "placeholder")}>
        <TextBolder size={20} />
      </ToolbarButton>
      <ToolbarButton type="button" title="Italic" onClick={() => insertMarkdown("*placeholder*", "placeholder")}>
        <TextItalic size={20} />
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Code"
        onClick={() => insertMarkdown("```\nplaceholder\n```", "placeholder")}
      >
        <Code size={20} />
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Link"
        onClick={() => insertMarkdown("[placeholder](url)", "placeholder")}
      >
        <LinkIcon size={20} />
      </ToolbarButton>
      <ToolbarButton
        type="button"
        title="Upload Image"
        onClick={() => fileInputRef.current?.click()}
        disabled={isFileUploading}
      >
        <Image size={20} />
      </ToolbarButton>
    </EditorToolbarContainer>
  )
}