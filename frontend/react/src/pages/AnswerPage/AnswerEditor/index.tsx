"use client"

import React from "react"

import { useState, useRef, useContext, Suspense } from "react"
import { useAccount } from "@starknet-react/core"
import { Code, FileArrowUp, Image, Link as LinkIcon, TextBolder, TextItalic, X } from "phosphor-react"
import {
  EditorContainer,
  EditorToolbar,
  ToolbarButton,
  EditorTextarea,
  EditorPreview,
  EditorTabs,
  EditorTab,
  SubmitButton,
  ErrorMessage,
  FileUploadArea,
  UploadProgress,
  UploadedFilePreview,
  UploadedImage,
  RemoveFileButton,
} from "./styles"
import { AnswersContext } from "../providers/AnswersProvider/answersContext"

import { shortenAddress } from "@utils/shortenAddress"
import { useWallet } from "@hooks/useWallet"
import { useStatusMessage } from "@hooks/useStatusMessage"

// Import dynamic components for markdown rendering
const ReactMarkdown = React.lazy(() => import("react-markdown"))
const remarkGfm = await import("remark-gfm").then((mod) => mod.default || mod)

// Mock file upload service
const uploadFile = async (file: File): Promise<{ id: string; url: string; name: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a temporary object URL for the file
      const objectUrl = URL.createObjectURL(file)
      resolve({
        id: `file_${Math.random().toString(36).substring(2, 15)}`,
        url: objectUrl,
        name: file.name,
      })
    }, 1000)
  })
}

export function AnswerEditor() {
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // File upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; url: string; name: string }>>([])

  const { isConnected, address } = useAccount()
  const { openConnectModal } = useWallet()
  const { answers, setAnswers } = useContext(AnswersContext)
  const { setStatusMessage } = useStatusMessage()

  // Handle tab switching
  const handleTabChange = (tab: "write" | "preview") => {
    setActiveTab(tab)
  }

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

          // Add image markdown to content
          const imageMarkdown = `![${file.name}](${uploadedFile.url})\n`
          setContent(content + imageMarkdown)

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
  const handleRemoveFile = async (fileId: string, fileUrl: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Remove from state
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))

    // Remove from content - find the markdown for this image and remove it
    const regex = new RegExp(`!\\[.*?\\]$${fileUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$\\n?`, "g")
    setContent(content.replace(regex, ""))

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(fileUrl)
  }

  const onAnswerSubmitted = (newAnswer: string) => {
    // Add the new answer to the list
    setAnswers([
      ...answers,
      {
        id: `a${answers.length + 1}`,
        authorAddress: address || "0x0",
        authorName: shortenAddress(address || "0x0") || "Anonymous",
        content: newAnswer,
        timestamp: "Just now",
        isCorrect: false,
        votes: 0,
      },
    ])

    setStatusMessage({
      type: "success",
      message: "Your answer has been submitted successfully!",
    })

    // Clear status message after 5 seconds
    setTimeout(() => {
      setStatusMessage({ type: null, message: "" })
    }, 5000)
  }

  // Handle answer submission
  const handleSubmit = async () => {
    // Validate content
    if (!content.trim()) {
      setError("Answer cannot be empty")
      return
    }

    // Check if user is connected
    if (!isConnected) {
      openConnectModal()
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, this would be a blockchain transaction or API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback with the answer content
      onAnswerSubmitted(content)

      // Reset the form
      setContent("")
      setActiveTab("write")
      setUploadedFiles([])
    } catch (err) {
      console.error("Error submitting answer:", err)
      setError("Failed to submit answer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Custom components for ReactMarkdown
  const components = {
    img: ({ ...props }) => (
      <img
        src={props.src || "/placeholder.svg"}
        alt={props.alt || ""}
        style={{ maxWidth: "100%", borderRadius: "4px", margin: "8px 0" }}
      />
    ),
  }

  return (
    <EditorContainer>
      <h2>Answer this question</h2>

      <EditorTabs>
        <EditorTab type="button" active={activeTab === "write"} onClick={() => handleTabChange("write")}>
          Write
        </EditorTab>
        <EditorTab type="button" active={activeTab === "preview"} onClick={() => handleTabChange("preview")}>
          Preview
        </EditorTab>
      </EditorTabs>

      {activeTab === "write" ? (
        <>
          <EditorToolbar>
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
              disabled={isUploading}
            >
              <Image size={20} />
            </ToolbarButton>
          </EditorToolbar>

          <EditorTextarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your answer here... You can use markdown for formatting."
            rows={8}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileUpload}
          />

          {isUploading ? (
            <UploadProgress value={uploadProgress}>
              <div style={{ width: `${uploadProgress}%` }}></div>
              <span>{Math.round(uploadProgress)}% Uploading...</span>
            </UploadProgress>
          ) : uploadedFiles.length === 0 ? (
            <FileUploadArea onClick={() => fileInputRef.current?.click()}>
              <FileArrowUp size={24} />
              <p>Click to upload images or drag and drop</p>
            </FileUploadArea>
          ) : (
            <UploadedFilePreview>
              {uploadedFiles.map((file) => (
                <div key={file.id}>
                  <UploadedImage src={file.url} alt={file.name} />
                  <RemoveFileButton onClick={(e) => handleRemoveFile(file.id, file.url, e)}>
                    <X size={16} />
                  </RemoveFileButton>
                </div>
              ))}
            </UploadedFilePreview>
          )}
        </>
      ) : (
        <EditorPreview>
          {content ? (
            <Suspense fallback={<p>Carregando visualização...</p>}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
              </ReactMarkdown>
          </Suspense>
          ) : (
            <p className="empty-preview">Your preview will appear here...</p>
          )}
        </EditorPreview>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </SubmitButton>
    </EditorContainer>
  )
}
