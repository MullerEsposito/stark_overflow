import styled from "styled-components"

export const EditorWriteContainer = styled.div`
  margin-bottom: 40px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  overflow: hidden;
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
