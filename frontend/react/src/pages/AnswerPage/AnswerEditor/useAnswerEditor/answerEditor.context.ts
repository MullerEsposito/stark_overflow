import { createContext } from "react"

export interface AnswerEditorContextType {
  content: string
  setContent: (content: string) => void
  uploadedFiles: Array<{ id: string; url: string; name: string }>
  setUploadedFiles: (files: Array<{ id: string; url: string; name: string }> | ((prev: Array<{ id: string; url: string; name: string }>) => Array<{ id: string; url: string; name: string }>)) => void;
  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
  transactionHash: string | null
  setTransactionHash: (transactionHash: string | null) => void
  activeTab: "write" | "preview"
  setActiveTab: (tab: "write" | "preview") => void
  fileUploadProgress: number
  setFileUploadProgress: React.Dispatch<React.SetStateAction<number>>
  isFileUploading: boolean
  setIsFileUploading: (isFileUploading: boolean) => void
  error: string | null
  setError: (error: string | null) => void;
}

export const AnswerEditorContext = createContext<AnswerEditorContextType>({} as AnswerEditorContextType);