import { FileUploadContainer, UploadedFilePreview, UploadedImage, UploadProgress, FileUploadArea, RemoveFileButton } from "./styles";
import { useAnswerEditor } from "../../useAnswerEditor";
import { FileArrowUp, X } from "phosphor-react";

interface FileUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement>
}

export function FileUpload({ fileInputRef }: FileUploadProps) {
  const { 
    isFileUploading,
    fileUploadProgress,
    uploadedFiles,
    setUploadedFiles,
    setContent,
    content,
  } = useAnswerEditor()

  const handleRemoveFile = async (fileId: string, fileUrl: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Remove from state
    setUploadedFiles(prev => prev.filter((f) => f.id !== fileId))

    // Remove from content - find the markdown for this image and remove it
    const regex = new RegExp(`!\\[.*?\\]$${fileUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$\\n?`, "g")
    setContent(content.replace(regex, ""))

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(fileUrl)
  }
  
  return (
    <FileUploadContainer>
      {isFileUploading 
        ? (<UploadProgress value={fileUploadProgress}>
            <div style={{ width: `${fileUploadProgress}%` }}></div>
            <span>{Math.round(fileUploadProgress)}% Uploading...</span>
          </UploadProgress>)
        : uploadedFiles.length === 0 
          ? (<FileUploadArea onClick={() => fileInputRef.current?.click()}>
              <FileArrowUp size={24} />
              <p>Click to upload images or drag and drop</p>
            </FileUploadArea>)
          : (<UploadedFilePreview>
              {uploadedFiles.map((file) => (
                <div key={file.id}>
                  <UploadedImage src={file.url} alt={file.name} />
                  <RemoveFileButton onClick={(e) => handleRemoveFile(file.id, file.url, e)}>
                    <X size={16} />
                  </RemoveFileButton>
                </div>
              ))}
            </UploadedFilePreview>)
      }
    </FileUploadContainer>
  )
}