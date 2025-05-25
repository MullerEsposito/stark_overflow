import styled from "styled-components"

export const EditorContainer = styled.div`
  margin-bottom: 40px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  overflow: hidden;
`

export const EditorTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`

export const EditorTab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  background: ${({ active, theme }) => (active ? theme.cardBackground : theme.background)};
  color: ${({ active, theme }) => (active ? theme.text : theme.textSecondary)};
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? "#7c3aed" : "transparent")};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

export const EditorToolbar = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  background: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
  }
`

export const EditorTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 16px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.7;
  }
`

export const EditorPreview = styled.div`
  min-height: 200px;
  padding: 16px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  
  img {
    max-width: 100%;
    border-radius: 4px;
  }
  
  pre {
    background: ${({ theme }) => theme.secondary || "#1e1e1e"};
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  code {
    font-family: monospace;
  }
  
  .empty-preview {
    color: ${({ theme }) => theme.textSecondary};
    font-style: italic;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`

export const FileUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  cursor: pointer;
  margin: 8px 0;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background};
    border-color: #7c3aed;
  }

  p {
    margin-top: 8px;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }
`

export const UploadProgress = styled.div<{ value: number }>`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  margin: 16px 0;
  position: relative;
  overflow: hidden;

  > div {
    position: absolute;
    height: 100%;
    background: #7c3aed;
    border-radius: 4px;
    transition: width 0.3s ease-out;
  }

  > span {
    position: absolute;
    top: 8px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`

export const UploadedFilePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;

  > div {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
  }
`

export const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const RemoveFileButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`

export const SubmitButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 0 0 8px 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  
  &:hover:not(:disabled) {
    background: #6d28d9;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`

export const ErrorMessage = styled.div`
  color: #ef4444;
  padding: 8px 16px;
  font-size: 0.9rem;
  background: rgba(239, 68, 68, 0.1);
`
