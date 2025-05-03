import styled from "styled-components";

export const DescriptionFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 8px;
`

export const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? "#7c3aed" : "transparent")};
  color: ${(props) => (props.active ? props.theme.text : props.theme.textSecondary)};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => props.theme.text};
  }
`

interface InputProps {
  hasError?: boolean
}

export const EditorContainer = styled.textarea<InputProps>`
  padding: 12px;
  font-size: 1rem;
  min-height: 200px;
  border: 1px solid ${(props) => (props.hasError ? "#ef4444" : props.theme.borderColor)};
  border-radius: 0 0 6px 6px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  resize: vertical;
  font-family: monospace;
  line-height: 1.5;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#ef4444" : "#7c3aed")};
    box-shadow: 0 0 0 2px ${(props) => (props.hasError ? "rgba(239, 68, 68, 0.2)" : "rgba(124, 58, 237, 0.2)")};
  }

  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.7;
  }
`

export const PreviewContainer = styled.div`
  padding: 12px;
  min-height: 200px;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 6px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  overflow-y: auto;
  line-height: 1.6;

  .markdown-preview {
    img {
      max-width: 100%;
      border-radius: 4px;
      margin: 1rem 0;
    }
  }

  .uploaded-images-preview {
    margin-bottom: 1rem;
    border-bottom: 1px dashed ${(props) => props.theme.borderColor};
    padding-bottom: 1rem;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;
  }

  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }

  blockquote {
    border-left: 4px solid ${(props) => props.theme.borderColor};
    padding-left: 1em;
    margin-left: 0;
    color: ${(props) => props.theme.textSecondary};
  }

  code {
    background: ${(props) => props.theme.borderColor};
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }

  pre {
    margin-bottom: 1em;
    overflow-x: auto;
  }

  img {
    max-width: 100%;
    border-radius: 4px;
  }

  a {
    color: #7c3aed;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .code-block {
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 4px;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .code-header {
    background: ${(props) => props.theme.borderColor};
    padding: 0.5rem 1rem;
    font-family: monospace;
    font-size: 0.8rem;
    color: ${(props) => props.theme.textSecondary};
  }

  .empty-preview {
    color: ${(props) => props.theme.textSecondary};
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
  padding: 24px;
  border: 2px dashed ${(props) => props.theme.borderColor};
  border-radius: 6px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.background};
    border-color: #7c3aed;
  }

  p {
    margin-top: 8px;
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.9rem;
  }
`

export const UploadedFilePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;

  > div {
    position: relative;
    width: 100px;
    height: 100px;
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

export const UploadProgress = styled.div<{ value: number }>`
  width: 100%;
  height: 4px;
  background: ${(props) => props.theme.borderColor};
  border-radius: 4px;
  margin-top: 12px;
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
    color: ${(props) => props.theme.textSecondary};
  }
`

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: -4px;
`