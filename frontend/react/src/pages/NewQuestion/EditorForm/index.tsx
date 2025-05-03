import { FileArrowUp, X } from "phosphor-react";
import { DescriptionFormContainer, EditorContainer, ErrorMessage, FileUploadArea, PreviewContainer, RemoveFileButton, Tab, TabContainer, UploadedFilePreview, UploadedImage, UploadProgress } from "./style";
import { useRef, useState } from "react";
import { uploadFile, UploadedFile, deleteFile } from "../../../services/file-upload";
import { Label } from "@components/Label";
import { Toolbar } from "./Toolbar";

// Import dynamic components for markdown rendering
const ReactMarkdown = await import("react-markdown").then((mod) => mod.default || mod)
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)

interface EditorFormProps {
  id: string
  value: string
  error: string
  setValue: (value: string) => void;
  validateForm: () => void;
}

export function EditorForm({ value, error, id, setValue, validateForm}: EditorFormProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  // Create a map of image URLs to their blob URLs for the preview
  const [imageMap, setImageMap] = useState<Record<string, string>>({})
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle tab switching
  const handleTabChange = (tab: "write" | "preview") => {
    setActiveTab(tab)
  }
  
  // Handle markdown toolbar actions
  const insertMarkdown = (markdownSyntax: string, placeholder = "") => {
    if (!textAreaRef.current) return

    const textarea = textAreaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = ""
    if (selectedText) {
      // If text is selected, wrap it with markdown syntax
      newText =
        value.substring(0, start) + markdownSyntax.replace(placeholder, selectedText) + value.substring(end)
    } else {
      // If no text is selected, just insert the markdown syntax with placeholder
      newText = value.substring(0, start) + markdownSyntax + value.substring(end)
    }

    setValue(newText)

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + markdownSyntax.indexOf(placeholder) + (selectedText ? selectedText.length : 0)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Check if it's an image
      if (file.type.startsWith("image/")) {
        setIsUploading(true)
        setUploadProgress(0)

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + Math.random() * 20
            return newProgress >= 90 ? 90 : newProgress
          })
        }, 200)

        try {
          // Upload the file
          const uploadedFile = await uploadFile(file)

          // Clear the interval and set progress to 100%
          clearInterval(progressInterval)
          setUploadProgress(100)

          // Add to uploaded files
          setUploadedFiles((prev) => [...prev, uploadedFile])

          // Add image markdown to description
          const imageMarkdown = `![${file.name}](${uploadedFile.url})\n`
            setValue(value + imageMarkdown)

          // Update the image map for preview
          setImageMap((prev) => ({
            ...prev,
            [uploadedFile.url]: uploadedFile.url,
          }))

          // Reset upload state after a delay
          setTimeout(() => {
            setIsUploading(false)
            setUploadProgress(0)
          }, 500)
        } catch (error) {
          console.error("File upload failed:", error)
          clearInterval(progressInterval)
          setIsUploading(false)
          setUploadProgress(0)
        }
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove uploaded file
  const handleRemoveFile = async (file: UploadedFile, e: React.MouseEvent) => {
    // Prevent event propagation to avoid form submission
    e.preventDefault()
    e.stopPropagation()

    try {
      // Delete the file
      await deleteFile(file.id)

      // Remove from state
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id))

      // Remove from description
      const imageMarkdown = `![${file.name}](${file.url})`
      setValue(value.replace(imageMarkdown, ""))

      // Remove from image map
      const newImageMap = { ...imageMap }
      delete newImageMap[file.url]
      setImageMap(newImageMap)
    } catch (error) {
      console.error("File deletion failed:", error)
    }
  }

  // Custom code component for syntax highlighting
  const CodeBlock: React.FC<CodeProps> = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "")
    const language = match ? match[1] : ""

    if (!inline && match) {
      return (
        <div className="code-block">
          <div className="code-header">
            <span>{language}</span>
          </div>
          <pre className={className} {...props}>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      )
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  // Custom image renderer that uses our image map
  const ImageRenderer = ({ src, alt }: ImageProps) => {
    if (!src) return null

    // Use the actual blob URL from our map
    return <img src={src || "/placeholder.svg"} alt={alt || ""} style={{ maxWidth: "100%" }} />
  }

  return (
    <DescriptionFormContainer>      
      <Label
        inputId={id}
        inputValue={value}
        labelText="Description"
        tooltipText="Be specific and imagine you're asking a question to another person"
        error={error}
      />

      <TabContainer>
        <Tab type="button" active={activeTab === "write"} onClick={() => handleTabChange("write")}>
          Write
        </Tab>
        <Tab type="button" active={activeTab === "preview"} onClick={() => handleTabChange("preview")}>
          Preview
        </Tab>
      </TabContainer>

      {activeTab === "write" ? (
        <>
          <Toolbar
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            insertMarkdown={insertMarkdown}
          />

          <EditorContainer
            id={id}
            ref={textAreaRef}
            placeholder="Describe your issue in detail. You can use markdown for formatting."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => validateForm()}
            hasError={!!error}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileUpload}
          />

          {isUploading 
            ? (
              <UploadProgress value={uploadProgress}>
                <div style={{ width: `${uploadProgress}%` }}></div>
                <span>{Math.round(uploadProgress)}% Uploading...</span>
              </UploadProgress>) 
            : uploadedFiles.length === 0 
              ? (
                <FileUploadArea onClick={() => fileInputRef.current?.click()}>
                  <FileArrowUp size={24} />
                  <p>Click to upload images or drag and drop</p>
                </FileUploadArea>)
              : (
                <UploadedFilePreview>
                  {uploadedFiles.map((file) => (
                    <div key={file.id}>
                      <UploadedImage src={file.url} alt={file.name} />
                      <RemoveFileButton onClick={(e) => handleRemoveFile(file, e)}>
                        <X size={16} />
                      </RemoveFileButton>
                    </div>
                  ))}
                </UploadedFilePreview>)
            }
        </>
      ) : (
        <PreviewContainer>
          {value ? (
            <div className="markdown-preview">
              {/* Render uploaded images directly for preview */}
              {uploadedFiles.length > 0 && (
                <div className="uploaded-images-preview">
                  {uploadedFiles.map((file) => (
                    <img
                      key={file.id}
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      style={{ maxWidth: "100%", marginBottom: "1rem" }}
                    />
                  ))}
                </div>
              )}

              {/* Render markdown content */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                  img: ImageRenderer,
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="empty-preview">Your preview will appear here...</p>
          )}
        </PreviewContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </DescriptionFormContainer>
  )
}

// Define proper types for the code component props
interface CodeProps {
  className?: string
  inline?: boolean
  children?: React.ReactNode
}

// Define proper types for the image component props
interface ImageProps {
  src?: string
  alt?: string
}