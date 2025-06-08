import { useState } from "react";
import { AnswerEditorContext } from "./answerEditor.context";

export function AnswerEditorProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState("")
  const [fileUploadProgress, setFileUploadProgress] = useState(0)
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; url: string; name: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  
  return (
    <AnswerEditorContext.Provider value={{
      content,
      setContent,
      fileUploadProgress,
      setFileUploadProgress,
      isFileUploading,
      setIsFileUploading,
      uploadedFiles,
      setUploadedFiles,
      isSubmitting,
      setIsSubmitting,
      transactionHash,
      setTransactionHash,
      activeTab,
      setActiveTab,
      error,
      setError,
    }}>
      {children}
    </AnswerEditorContext.Provider>
  )
}