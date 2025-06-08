import { useRef } from "react";
import { useAnswerEditor } from "../useAnswerEditor";
import { EditorToolbar } from "./EditorToolbar";
import { FileUpload } from "./FileUpload";
import { EditorTextarea, EditorWriteContainer } from "./styles";

export function EditorWrite() {  
  const textAreaRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>

  const { 
    content,
    setContent,
    setUploadedFiles,
    setIsFileUploading,
    setFileUploadProgress,
  } = useAnswerEditor()

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Check if it's an image
      if (file.type.startsWith("image/")) {
        setIsFileUploading(true)
        setFileUploadProgress(0)

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setFileUploadProgress((prev) => {
            const newProgress = prev + Math.random() * 20
            return newProgress >= 90 ? 90 : newProgress
          })
        }, 200)

        try {
          // Upload the file
          const uploadedFile = await uploadFile(file)

          // Clear the interval and set progress to 100%
          clearInterval(progressInterval)
          setFileUploadProgress(100)

          // Add to uploaded files
          setUploadedFiles((prev) => [...prev, uploadedFile])

          // Add image markdown to content
          const imageMarkdown = `![${file.name}](${uploadedFile.url})\n`
          setContent(content + imageMarkdown)

          // Reset upload state after a delay
          setTimeout(() => {
            setIsFileUploading(false)
            setFileUploadProgress(0)
          }, 500)
        } catch (error) {
          console.error("File upload failed:", error)
          clearInterval(progressInterval)
          setIsFileUploading(false)
          setFileUploadProgress(0)
        }
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
    
  return (
    <EditorWriteContainer>
      <EditorToolbar textAreaRef={textAreaRef} fileInputRef={fileInputRef} />

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

      <FileUpload fileInputRef={fileInputRef} />
    </EditorWriteContainer>
  )
}